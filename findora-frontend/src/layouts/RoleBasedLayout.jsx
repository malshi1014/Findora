import DashboardLayout from "../layouts/DashboardLayout";
import ShopLayout from "../layouts/ShopLayout";

function RoleBasedLayout({ children }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("findora_user"));
  } catch {
    user = null;
  }

  if (user?.role === "shop_owner") {
    return <ShopLayout>{children}</ShopLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

export default RoleBasedLayout;