from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework import status
from .models import Product, Category, Cart, CartItem, Order, OrderItem, UserProfile
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer, OrderSerializer
import urllib.request
import json

@api_view(['GET'])
def get_products(request):
    category_id = request.GET.get('category')

    products = Product.objects.all()

    if category_id:
        products = products.filter(category_id=category_id)
    
    serializer = ProductSerializer(
        products,
        many=True,
        context={'request': request}
    )

    return Response(serializer.data)

@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, context = {'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=404
        )
    cart, created = Cart.objects.get_or_create(user=request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += 1
        item.save()
    return Response({'message': 'Product added to cart',"cart":CartSerializer(cart).data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')
   
    if not item_id or quantity is None:
        return Response({'error': 'Item ID and quantity are required'}, status=400)
    
    try:
        item = CartItem.objects.get(id=item_id)
        if int(quantity) < 1:
            item.delete()
            return Response({'error': 'Quantity must be at least 1'}, status=400)
        
        item.quantity = quantity
        item.save()
        serializer = CartItemSerializer(item)
        return Response(serializer.data)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({'message': 'Item removed from cart'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method')

        if payment_method == "online":
            pass

        #validate Phone Number
        # if not phone.isdigit() or len(phone) < 10:
        #     return Response({'error': 'Invalid phone number'}, status=400)
        
        # Get user's cart
        cart , created = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=400)
        
        total = sum([item.product.price * item.quantity for item in cart.items.all()])

        order = Order.objects.create(user = request.user, name = name, address = address, phone = phone,
                                     payment_method = payment_method, total_amount=total)
        serializer = OrderSerializer(order)
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
        # Clear the cart
        cart.items.all().delete()

        print("serializer:", serializer)
        print("serializer:", serializer.data)
        return Response({'message': 'Order created successfully', 'order_id': serializer.data})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    orders = Order.objects.filter(
        user=request.user
    ).order_by('-created_at')
    result = []
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order(request, pk):
    try:
        order = Order.objects.prefetch_related('items__product').get(id=pk, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)

    serializer = OrderSerializer(order, context={'request': request})
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order(request, pk):
    try:
        order = Order.objects.get(
            id=pk,
            user=request.user
        )
    except Order.DoesNotExist:
        return Response(
            {'error': 'Order not found'},
            status=404
        )

    if order.status not in ['PENDING', 'CONFIRMED']:
        return Response(
            {'error': 'Order cannot be edited at this stage'},
            status=400
        )

    name = request.data.get('name')
    address = request.data.get('address')
    phone = request.data.get('phone')

    if name is not None:
        order.name = name

    if address is not None:
        order.address = address

    if phone is not None:
        if not phone.isdigit() or len(phone) > 11:
            return Response(
                {'error': 'Invalid phone number'},
                status=400
            )
        order.phone = phone

    order.save()

    return Response({
        'message': 'Order updated successfully'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    print("Register view called with data:", request.data)  # Debugging line
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created successfully", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_sepay_payment(request):
    expected_text = request.GET.get('ref', '')
    if not expected_text:
        return Response({'success': False, 'message': 'Missing ref parameter'})
    
    try:
        req = urllib.request.Request(
            'https://my.sepay.vn/userapi/transactions/list',
            headers={
                'Authorization': 'Bearer FUGN53XYODJLTHN5BSGMQJE9PIIE7R7XQ8CZT1GAY0ZABASF9D3ARPPG1CCNKMWR',
                'Content-Type': 'application/json'
            }
        )
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
        
        if data and 'transactions' in data:
            for tx in data['transactions']:
                if 'transaction_content' in tx and expected_text.lower() in tx['transaction_content'].lower():
                    return Response({'success': True, 'message': 'Payment found', 'transaction': tx})
                    
        return Response({'success': False, 'message': 'Payment not found yet'})
    except Exception as e:
        return Response({'success': False, 'error': str(e)})
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product(request):
    print("-------------------------------------")
    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'User profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # if profile.role != 'manager':
    #     return Response(
    #         {'error': 'Only managers can create products'},
    #         status=status.HTTP_403_FORBIDDEN
    #     )

    serializer = ProductSerializer(data=request.data)

    if serializer.is_valid():
        product = serializer.save()

        return Response(
            ProductSerializer(product).data,
            status=status.HTTP_201_CREATED
        )
    print("❌ SERIALIZER ERRORS:", serializer.errors)
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product(request, pk):
    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'User profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if profile.role != 'manager':
        return Response(
            {'error': 'Only managers can update products'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProductSerializer(
        product,
        data=request.data
    )

    if serializer.is_valid():
        product = serializer.save()

        return Response(
            ProductSerializer(product).data,
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        return Response(
            {'error': 'User profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if profile.role != 'manager':
        return Response(
            {'error': 'Only managers can delete products'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    product.delete()

    return Response(
        {'message': 'Product deleted successfully'},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_qr(request):
    try:
        amount = request.data.get('amount')
        order_ref = request.data.get('order_ref')
        
        add_info = f"Chuyen tien mua hang tai MohitCart {order_ref}"
        
        payload = {
            "accountNo": "0384758477",
            "accountName": "NGO THANH LUC",
            "acqId": 970422,
            "amount": amount,
            "addInfo": add_info,
            "template": "compact2"
        }
        
        req = urllib.request.Request(
            'https://api.vietqr.io/v2/generate',
            data=json.dumps(payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json'
            },
            method='POST'
        )
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
        if data.get('code') == '00':
            return Response({'success': True, 'qrDataURL': data['data']['qrDataURL']})
        else:
            return Response({'success': False, 'message': data.get('desc')})
            
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)
