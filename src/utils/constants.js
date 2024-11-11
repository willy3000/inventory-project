export const BASE_URL = "http://192.168.3.243:5000";
// export const BASE_URL = "http://localhost:5000";
import CryptoJS from "crypto-js";

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long", // 'short', 'narrow' for shorter names
    year: "numeric",
    month: "long", // 'short' for abbreviated month names
    day: "numeric",
  });
};

// Function to encrypt token
export const encryptToken = (token) => {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY; // Keep this secret and secure
  const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();
  return encryptedToken;
};

export const decryptToken = (token) => {
  if (token) {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const bytes = CryptoJS.AES.decrypt(token, secretKey);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
  }
};

// export async function getServerSideProps({ req }) {
//   // Parse cookies from the request
//   const { token } = await cookie.parse(
//     req ? req.headers.cookie || "" : document.cookie
//   );
//   alert(token);
//   return token;
// }

export const copyTextToClipboard = (text) => {
  // Check if Clipboard API is supported
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text successfully copied to clipboard:", text);
      })
      .catch((err) => {
        console.error("Failed to copy text to clipboard:", err);
      });
  } else {
    // Fallback method using a temporary <textarea> element
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoids page scroll
    textArea.style.opacity = "0"; // Hide the element
    document.body.appendChild(textArea);
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      const msg = successful
        ? "Fallback: Text copied to clipboard"
        : "Fallback: Copy failed";
      console.log(msg);
    } catch (err) {
      console.error("Fallback: Unable to copy", err);
    }

    document.body.removeChild(textArea);
  }
};
