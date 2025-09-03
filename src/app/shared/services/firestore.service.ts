import { inject, Injectable, isDevMode } from "@angular/core";
import { QueryConstraint } from "@firebase/firestore";
import { Observable } from "rxjs";
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  docData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "@angular/fire/firestore";
import { DocumentData } from "@angular/fire/compat/firestore";
import { Storeable } from "@interfaces";

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);

  constructor() {
    if (isDevMode()) {
      connectFirestoreEmulator(this.firestore, '127.0.0.1', 8088);
    } else {

    }
  }

  /**
   * Returns a reference to an AngularFirestoreCollection.
   *
   * @param {string} collectionName The name of the collection.
   * @param {QueryConstraint} queryFn Optional query function to narrow the result set. Should be something like this: orderBy('createdAt', 'desc')
   * @param {string} idField
   */
  public getCollection<T extends Storeable>(collectionName: string, queryFn?: QueryConstraint[], idField: keyof T = "id"): Observable<T[]> {
    const firestoreCollection = collection(this.firestore, collectionName) as CollectionReference<T>;
    if (queryFn) {
      return collectionData<T>(query<T, DocumentData>(firestoreCollection, ...queryFn), { idField: idField });
    }
    return collectionData<T>(firestoreCollection, { idField });
  }

  public async getSnapshot<T>(collectionName: string): Promise<T[]> {
    const firestoreCollection = collection(this.firestore, collectionName) as CollectionReference<T>;
    const querySnapshot = await getDocs<T, DocumentData>(firestoreCollection);
    const data: T[] = [];
    querySnapshot.forEach(doc => {
      data.push(doc.data());
    });
    return data;
  }

  /**
   * Returns a reference to an AngularFirestoreCollection.
   *
   * @param {string} collectionName The name of the collection.
   * @param {QueryConstraint} queryFn Optional query function to narrow the result set. Should be something like this: orderBy('createdAt', 'desc')
   * @param {string} idField
   */
  public async getCollectionAsync<T extends Storeable>(collectionName: Promise<string>, queryFn?: QueryConstraint[], idField: keyof T = "id"): Promise<Observable<T[]>> {
    return this.getCollection(await collectionName, queryFn, idField);
  }

  public getDocumentReference<T>(collectionName: string, documentId: string): DocumentReference<T> {
    return doc(this.firestore, collectionName + "/" + documentId) as DocumentReference<T>;
  }

  /**
   * Create a reference to a single document in a collection.
   *
   * @param {string} collectionName The name of the collection where the document is stored.
   * @param {string} documentId The id of the requested document.
   */
  getDocument<T>(collectionName: string, documentId: string): Promise<DocumentSnapshot<T>> {
    const docRef = this.getDocumentReference<T>(collectionName, documentId);
    return getDoc<T, DocumentData>(docRef);
  }

  /**
   *
   * @param {string} collectionName
   * @param {string} documentId
   * @param {string}  idField
   */
  public async getDocumentWithChanges<T extends Storeable>(collectionName: string, documentId: string, idField: keyof T = "id"): Promise<Observable<T | undefined>> {
    const docRef = this.getDocumentReference<T>(collectionName, documentId);
    return docData<T>(docRef, { idField: idField });
  }

  async addItem<T>(collectionName: string, item: T): Promise<DocumentReference<T>> {
    const collectionRef = collection(
      this.firestore,
      collectionName,
    ) as CollectionReference<T>;
    return addDoc(collectionRef, item);
  }

  updateItem<T>(collectionName: string, item: T, documentId: string): Promise<void> {
    const doc: DocumentReference<T> = this.getDocumentReference<T>(collectionName, documentId);
    return setDoc(doc, item);
  }

  deleteItem<T>(collectionName: string, itemId: string): Promise<void> {
    const docRef = this.getDocumentReference<T>(collectionName, itemId);
    return deleteDoc(docRef);
  }
}
