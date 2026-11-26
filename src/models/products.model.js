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
const localFile = path.join(__dirname, "../data/products.json");

const productsCol = collection(db, "products");

// Carga datos locales si no hay conexion
const getLocalProducts = () => {
  try {
    if (!fs.existsSync(localFile)) return [];
    return JSON.parse(fs.readFileSync(localFile, "utf-8"));
  } catch (e) {
    return [];
  }
};

const saveLocalProducts = (data) => {
  try {
    fs.mkdirSync(path.dirname(localFile), { recursive: true });
    fs.writeFileSync(localFile, JSON.stringify(data, null, 2));
  } catch (e) {}
};

const isConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID && !process.env.FIREBASE_PROJECT_ID.includes("tu_proyecto")
);

export const ProductsModel = {
  async getAll() {
    if (isConfigured) {
      try {
        const snap = await getDocs(productsCol);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        return getLocalProducts();
      }
    }
    return getLocalProducts();
  },

  async getById(id) {
    if (isConfigured) {
      try {
        const docRef = doc(db, "products", id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return null;
        return { id: snap.id, ...snap.data() };
      } catch (err) {
        const list = getLocalProducts();
        return list.find(p => String(p.id) === String(id)) || null;
      }
    }
    const list = getLocalProducts();
    return list.find(p => String(p.id) === String(id)) || null;
  },

  async create(data) {
    const newItem = { ...data, createdAt: new Date().toISOString() };
    if (isConfigured) {
      try {
        const docRef = await addDoc(productsCol, newItem);
        return { id: docRef.id, ...newItem };
      } catch (err) {
        const list = getLocalProducts();
        const created = { id: `prod-${Date.now()}`, ...newItem };
        list.push(created);
        saveLocalProducts(list);
        return created;
      }
    }
    const list = getLocalProducts();
    const created = { id: `prod-${Date.now()}`, ...newItem };
    list.push(created);
    saveLocalProducts(list);
    return created;
  },

  async update(id, data) {
    if (isConfigured) {
      try {
        const docRef = doc(db, "products", id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return null;
        await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
        return { id, ...snap.data(), ...data };
      } catch (err) {
        const list = getLocalProducts();
        const idx = list.findIndex(p => String(p.id) === String(id));
        if (idx === -1) return null;
        list[idx] = { ...list[idx], ...data };
        saveLocalProducts(list);
        return list[idx];
      }
    }
    const list = getLocalProducts();
    const idx = list.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data };
    saveLocalProducts(list);
    return list[idx];
  },

  async delete(id) {
    if (isConfigured) {
      try {
        const docRef = doc(db, "products", id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return null;
        await deleteDoc(docRef);
        return { id, deleted: true };
      } catch (err) {
        const list = getLocalProducts();
        const idx = list.findIndex(p => String(p.id) === String(id));
        if (idx === -1) return null;
        list.splice(idx, 1);
        saveLocalProducts(list);
        return { id, deleted: true };
      }
    }
    const list = getLocalProducts();
    const idx = list.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;
    list.splice(idx, 1);
    saveLocalProducts(list);
    return { id, deleted: true };
  }
};
