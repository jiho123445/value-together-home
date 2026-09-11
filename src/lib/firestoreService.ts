// firestoreService.ts intentionally has no Firestore SDK imports of its own
// — handleFirestoreError() below is pure logging, kept separate so it can
// be called from anywhere without pulling in Firestore types.

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
}

// Top-level collection name for the (split-by-document) public site content
// — settings/timeline/programs/notices/gallery/popups/partners each live as
// their own document under this collection. Kept as a named constant so
// every call site agrees on the name; ValueTogetherContext.tsx, firestore.rules
// and storage.rules all use this same literal ('content').
export const CONTENT_COLLECTION = 'content';
