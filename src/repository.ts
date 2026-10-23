export class Repository<Entity extends { readonly id: number }> {
  private readonly items: Entity[] = [];

  add(item: Entity): void {
    if (!Number.isSafeInteger(item.id) || item.id < 1) {
      throw new Error("Identifier must be a positive safe integer");
    }

    if (this.items.some(existingItem => existingItem.id === item.id)) {
      throw new Error(`Identifier ${item.id} already exists`);
    }

    this.items.push(structuredClone(item));
  }

  findById(id: number): Entity | undefined {
    const item = this.items.find(existingItem => existingItem.id === id);

    if (item === undefined) {
      return undefined;
    }

    return structuredClone(item);
  }

  getAll(): Entity[] {
    return structuredClone(this.items);
  }

  update(id: number, changes: Partial<Omit<Entity, "id">>): boolean {
    const itemIndex = this.items.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return false;
    }

    const currentItem = this.items[itemIndex];

    const updatedItem = {
      ...currentItem,
      ...changes,
      id: currentItem.id
    };

    this.items[itemIndex] = structuredClone(updatedItem);

    return true;
  }
}