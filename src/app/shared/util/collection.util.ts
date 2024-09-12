export class CollectionUtil {
  public static getSubCollectionName(panschCollectionName: string, panschId: string, subCollectionName: string): string {
    return `${panschCollectionName}/${panschId}/${subCollectionName}`;
  }
}
