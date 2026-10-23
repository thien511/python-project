
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Truck,
  ShieldCheck,
  Headphones,
  ArrowUpRight,
} from "lucide-react";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-[#071733] via-[#102D62] to-[#173B87] text-white mt-10">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-14">

        {/* Nội dung chính */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Cột 1: Thương hiệu */}
          <div>
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <ShoppingBag size={25} className="text-blue-200" />
              </span>

              <span className="text-3xl font-extrabold tracking-tight">
                LapZone
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-7 text-blue-100/80">
              LapZone – Công nghệ đồng hành cùng bạn.
              Khám phá những mẫu laptop phù hợp cho học tập,
              làm việc và giải trí.
            </p>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-2">
                <Headphones size={19} className="text-blue-200" />
                <h3 className="font-semibold text-white">
                  Hỗ trợ khách hàng
                </h3>
              </div>

              <p className="text-sm leading-6 text-blue-100/80">
                Tư vấn mua laptop, hỗ trợ đơn hàng và
                giải đáp thắc mắc về sản phẩm.
              </p>

              <Link
                to="/"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-200 transition hover:text-white"
              >
                Xem sản phẩm
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          {/* Cột 2: Thông tin */}
          <div>
            <h3 className="mb-6 border-b border-white/20 pb-3 text-base font-bold">
              Thông tin
            </h3>

            <ul className="space-y-4 text-sm text-blue-100/80">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/" className="transition hover:text-white">
                  Danh sách laptop
                </Link>
              </li>
              <li>
                <span className="cursor-default">
                  Laptop học tập và văn phòng
                </span>
              </li>
              <li>
                <span className="cursor-default">
                  Laptop gaming
                </span>
              </li>
              <li>
                <Link to="/signup" className="transition hover:text-white">
                  Đăng ký thành viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Chính sách */}
          <div>
            <h3 className="mb-6 border-b border-white/20 pb-3 text-base font-bold">
              Chính sách và dịch vụ
            </h3>

            <ul className="space-y-4 text-sm text-blue-100/80">
              <li className="flex items-center gap-2">
                <Truck size={16} className="shrink-0 text-blue-200" />
                <span>Giao hàng toàn quốc</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="shrink-0 text-blue-200" />
                <span>Hỗ trợ bảo hành sản phẩm</span>
              </li>
              <li>
                <span>Thu cũ lên đời mới tại cửa hàng</span>
              </li>
              <li>
                <span>Hướng dẫn thanh toán</span>
              </li>
              <li>
                <span>Chính sách đổi trả</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="mb-6 border-b border-white/20 pb-3 text-base font-bold">
              Địa chỉ & Liên hệ
            </h3>

            <div className="space-y-5 text-sm text-blue-100/80">
              <p className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-blue-200" />
                <span>
                  Thông tin cửa hàng: 76 Man Thiện
                </span>
              </p>

              <p className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-blue-200" />
                <span>
                  Hotline hỗ trợ: 0983361733
                </span>
              </p>

              <p className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-blue-200" />
                <span>
                  Email hỗ trợ: projectpython@gmail.com
                </span>
              </p>

              <div className="border-t border-white/10 pt-4">
                <Link
                  to="/login"
                  className="block py-1 transition hover:text-white"
                >
                  Tài khoản của tôi
                </Link>

                <Link
                  to="/myOrder"
                  className="block py-1 transition hover:text-white"
                >
                  Đơn hàng của tôi
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Thanh bản quyền */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/20 pt-6 text-xs text-blue-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} LapZone.
            All rights reserved.
          </p>

          <p>
            LapZone • Laptop & Technology
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
