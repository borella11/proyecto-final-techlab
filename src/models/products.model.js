import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../config/firebase.config.js";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data/products.json");

const COLLECTION_NAME = "products";

/**
 * Determina si las credenciales de Firebase en .env son reales o valores por defecto
 */
const isFirebaseReady = () => {
  const apiKey = process.env.FIREBASE_API_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  return (
    Boolean(apiKey) &&
    Boolean(projectId) &&
    !apiKey.includes("tu_api_key") &&
    !projectId.includes("tu_proyecto")
  );
};

/**
 * Lee los productos del archivo JSON local de respaldo
 */
const readLocalData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("[Storage] Error al leer productos locales:", err.message);
    return [];
  }
};

/**
 * Guarda los productos en el archivo JSON local de respaldo
 */
const writeLocalData = (data) => {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[Storage] Error al guardar productos locales:", err.message);
  }
};

export const ProductsModel = {
  /**
   * Obtiene todos los productos (desde Firestore o almacenamiento local)
   */
  async getAll() {
    if (isFirebaseReady()) {
      try {
        const productsCol = collection(db, COLLECTION_NAME);
        const snapshot = await getDocs(productsCol);
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
      } catch (error) {
        console.warn(
          "[Firebase] No se pudo conectar con Firestore remoto. Cargando catálogo local:",
          error.message
        );
        return readLocalData();
      }
    }

    // Modo local cuando aún no se ingresaron claves de Firebase
    return readLocalData();
  },

  /**
   * Obtiene un producto por su ID
   * @param {string} id
   */
  async getById(id) {
    if (isFirebaseReady()) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          return null;
        }

        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } catch (error) {
        console.warn(
          "[Firebase] Error al consultar Firestore. Buscando en catálogo local:",
          error.message
        );
        const products = readLocalData();
        return products.find((p) => String(p.id) === String(id)) || null;
      }
    }

    const products = readLocalData();
    return products.find((p) => String(p.id) === String(id)) || null;
  },

  /**
   * Crea un nuevo producto
   * @param {Object} productData
   */
  async create(productData) {
    const timestamp = new Date().toISOString();

    if (isFirebaseReady()) {
      try {
        const productsCol = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(productsCol, {
          ...productData,
          createdAt: timestamp
        });

        return {
          id: docRef.id,
          ...productData,
          createdAt: timestamp
        };
      } catch (error) {
        console.warn(
          "[Firebase] Error al guardar en Firestore. Guardando en catálogo local:",
          error.message
        );
        const products = readLocalData();
        const newProduct = {
          id: `prod-${Date.now()}`,
          ...productData,
          createdAt: timestamp
        };
        products.push(newProduct);
        writeLocalData(products);
        return newProduct;
      }
    }

    const products = readLocalData();
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...productData,
      createdAt: timestamp
    };
    products.push(newProduct);
    writeLocalData(products);
    return newProduct;
  },

  /**
   * Actualiza un producto existente
   * @param {string} id
   * @param {Object} updateData
   */
  async update(id, updateData) {
    const timestamp = new Date().toISOString();

    if (isFirebaseReady()) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          return null;
        }

        await updateDoc(docRef, {
          ...updateData,
          updatedAt: timestamp
        });

        return {
          id,
          ...docSnap.data(),
          ...updateData,
          updatedAt: timestamp
        };
      } catch (error) {
        console.warn(
          "[Firebase] Error al actualizar en Firestore. Actualizando localmente:",
          error.message
        );
        const products = readLocalData();
        const index = products.findIndex((p) => String(p.id) === String(id));
        if (index === -1) return null;

        products[index] = {
          ...products[index],
          ...updateData,
          updatedAt: timestamp
        };
        writeLocalData(products);
        return products[index];
      }
    }

    const products = readLocalData();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updateData,
      updatedAt: timestamp
    };
    writeLocalData(products);
    return products[index];
  },

  /**
   * Elimina un producto por su ID
   * @param {string} id
   */
  async delete(id) {
    if (isFirebaseReady()) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          return null;
        }

        await deleteDoc(docRef);
        return { id, deleted: true };
      } catch (error) {
        console.warn(
          "[Firebase] Error al eliminar en Firestore. Eliminando localmente:",
          error.message
        );
        const products = readLocalData();
        const index = products.findIndex((p) => String(p.id) === String(id));
        if (index === -1) return null;

        products.splice(index, 1);
        writeLocalData(products);
        return { id, deleted: true };
      }
    }

    const products = readLocalData();
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index === -1) return null;

    products.splice(index, 1);
    writeLocalData(products);
    return { id, deleted: true };
  }
};
