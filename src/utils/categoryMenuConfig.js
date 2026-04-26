import catPijamas from "@/assets/catPijamas.jpg";
import catCasual from "@/assets/catCasual.jpg";
import catDeportiva from "@/assets/catDeportiva.jpg";

export const CATEGORY_MENU_ITEMS = [
  {
    key: "pijamas",
    name: "Pijamas",
    path: "/Pijamas",
    image: catPijamas,
    alt: "categoria pijamas",
  },
  {
    key: "casual",
    name: "Casual",
    path: "/Casual",
    image: catCasual,
    alt: "categoria casual",
  },
  {
    key: "deportiva",
    name: "Deportivo",
    path: "/Deportiva",
    image: catDeportiva,
    alt: "categoria deportiva",
  },
];

export const getCategoryMenuKey = (categoryName = "") => {
  const normalizedName = categoryName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalizedName.includes("pijama")) return "pijamas";
  if (normalizedName.includes("casual")) return "casual";
  if (normalizedName.includes("deport")) return "deportiva";

  return normalizedName.trim();
};

export const getDefaultCategoryMenuImage = (categoryName = "") => {
  const key = getCategoryMenuKey(categoryName);
  return CATEGORY_MENU_ITEMS.find((item) => item.key === key)?.image || null;
};
