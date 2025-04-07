import { API_URL } from "./MainApi";

export const uploadImage = (image) =>
    image ? `${API_URL}${image}` : "https://www.exscribe.com/wp-content/uploads/2021/08/placeholder-image-person-jpg.jpg";
