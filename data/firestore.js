// Import the functions you need from the SDKs you need
import { create } from "domain";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    setDoc,
    getDoc,
    Timestamp,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGEING_SENDER_ID,
    appId: process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

//bring every todos
export async function fetchTodos() {
    const todosRef = collection(db, "todos");
    const descQuery = query(todosRef, orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(descQuery);

    if (querySnapshot.empty) {
        return [];
    }

    const fetchedTodos = [];

    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());

        const docData = doc.data();
        let created_at = docData["created_at"];

        // Check if created_at exists and is a timestamp object
        if (created_at && typeof created_at.toDate === "function") {
            created_at = created_at.toDate();
        } else {
            // Provide a default value or handle the case where created_at is not available
            created_at = new Date(); // Using current date as a fallback
        }

        const aTodo = {
            id: doc.id,
            title: docData["title"],
            is_done: docData["is_done"],
            created_at: created_at,
        };
        fetchedTodos.push(aTodo);
    });
    return fetchedTodos;
}

//add todo list
export async function addATodo({ title }) {
    // Add a new document with a generated id
    const newTodoRef = doc(collection(db, "todos"));

    const createdAtTimestamp = Timestamp.fromDate(new Date());

    const newTodoData = {
        id: newTodoRef.id,
        title: title,
        is_done: false,
        created_at: createdAtTimestamp,
    };
    // later...
    await setDoc(newTodoRef, newTodoData);

    return newTodoData;
}

//bring single todo
export async function fetchATodo(id) {
    if (!id) return null; // Early return if id is falsy
    const todoDocRef = doc(db, "todos", id);
    const todoDocSnap = await getDoc(todoDocRef);

    if (!todoDocSnap.exists()) {
        console.log("No such document!");
        return null;
    }

    console.log("Document data:", todoDocSnap.data());
    const docData = todoDocSnap.data();
    let created_at = docData.created_at;

    // Ensure that created_at is a Firestore timestamp before calling toDate()
    if (created_at && typeof created_at.toDate === "function") {
        created_at = created_at.toDate();
    } else {
        created_at = new Date(); // Fallback if created_at is not a Firestore timestamp
    }

    return {
        id: todoDocSnap.id,
        title: docData.title,
        is_done: docData.is_done,
        created_at: created_at,
    };
}

//delete a todo
export async function deleteATodo(id) {
    const fetchedTodo = await fetchATodo(id);

    if (fetchedTodo === null) {
        return null;
    }

    // Make sure to pass just the id string to the doc function
    await deleteDoc(doc(db, "todos", id));
    return fetchedTodo;
}

//edit a todo
export async function editATodo(id, { title, is_done }) {
    const fetchedTodo = await fetchATodo(id);

    if (fetchedTodo === null) {
        return null;
    }

    const todoRef = doc(db, "todos", id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(todoRef, {
        title: title,
        is_done: is_done,
    });

    return {
        id: id,
        title: title,
        is_done: is_done,
        created_at: fetchedTodo.created_at,
    };
}
