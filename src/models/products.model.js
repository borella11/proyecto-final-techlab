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

const COLLECTION_NAME = "products";
const productsCollection = collection(db, COLLECTION_NAME);

export const ProductsModel = {
  /**
   * Obtiene todos los productos de Firestore
   */
  async getAll() {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  },

  /**
   * Obtiene un producto por su ID
   * @param {string} id
   */
  async getById(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  },

  /**
   * Crea un nuevo producto en Firestore
   * @param {Object} productData
   */
  async create(productData) {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: new Date().toISOString()
    });

    return {
      id: docRef.id,
      ...productData
    };
  },

  /**
   * Actualiza un producto existente
   * @param {string} id
   * @param {Object} updateData
   */
  async update(id, updateData) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });

    return {
      id,
      ...docSnap.data(),
      ...updateData
    };
  },

  /**
   * Elimina un producto por su ID
   * @param {string} id
   */
  async delete(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    await deleteDoc(docRef);
    return { id, deleted: true };
  }
};
