export class Entity {
    id = '';

    constructor() {
        this.id = crypto.randomUUID();
    }
}