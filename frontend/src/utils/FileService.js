import { API_URL } from "../http/httpClient";
import { httpClient } from "../http/httpClient";

export default class FileService {
  static async urlToFile(filename, mimeType) {
    const response = await httpClient.get(`${API_URL}/profile/edit/photo`, {
      responseType: "blob",
    });

    const blob = response.data;

    return new File([blob], filename, {
      type: mimeType || blob.type,
    });
  }

  static async loadFileByUrl(url) {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1] || "photo.jpg";

    const ext = fileName.split(".").pop()?.toLowerCase();
    const mimeType =
      ext === "png" ? "image/png" : ext === "gif" ? "image/gif" : "image/jpeg"; // по умолчанию jpeg

    const file = await FileService.urlToFile(fileName, mimeType);

    return [file, fileName];
  }
}
