// Firebase Configuration for Sweet Crumbs Bakery
// This connects the website to a shared cloud database (Firestore) so that
// any product the Admin adds/edits/deletes is saved permanently and shown
// to every visitor, on every device.

const firebaseConfig = {
  apiKey: "AIzaSyAlm_5XFAdymEiw4HRUGImPVfm9963AAm4",
  authDomain: "sweetcrumbs-bakery.firebaseapp.com",
  projectId: "sweetcrumbs-bakery",
  storageBucket: "sweetcrumbs-bakery.firebasestorage.app",
  messagingSenderId: "741424369780",
  appId: "1:741424369780:web:4722af198fbbc4ca22c121"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ---- Product Image Upload Helper ----

// Uploads a photo file selected by the Admin directly to Firebase Storage
// and returns a permanent, public download URL to save on the product.
async function uploadProductImageToCloud(file) {
  const fileRef = storage.ref('product-images/' + Date.now() + '_' + file.name);
  await fileRef.put(file);
  const url = await fileRef.getDownloadURL();
  return url;
}

// ---- Product Cloud Helpers ----

// Fetch all products from the shared 'products' collection in Firestore
async function fetchProductsFromCloud() {
  const snapshot = await db.collection('products').get();
  const products = [];
  snapshot.forEach(doc => {
    products.push({ ...doc.data(), id: Number(doc.id) });
  });
  return products;
}

// One-time seed: if the cloud database is empty (very first run), push the
// starter catalog (from mockData.js) into Firestore so it isn't empty.
async function seedProductsIfEmpty() {
  const snapshot = await db.collection('products').get();
  if (snapshot.empty && window.bakeryProducts) {
    const batch = db.batch();
    window.bakeryProducts.forEach(prod => {
      const ref = db.collection('products').doc(String(prod.id));
      batch.set(ref, prod);
    });
    await batch.commit();
    return [...window.bakeryProducts];
  }
  return null;
}

// Save (add or update) a single product permanently to the cloud database
async function saveProductToCloud(product) {
  await db.collection('products').doc(String(product.id)).set(product);
}

// Permanently delete a product from the cloud database
async function deleteProductFromCloud(productId) {
  await db.collection('products').doc(String(productId)).delete();
}
