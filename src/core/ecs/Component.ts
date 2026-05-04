import { immerable } from "immer";
import { getId } from "../../utils/getId";
import type { Unique } from "./Unique";

export abstract class Component implements Unique {
    [immerable] = true
    id = '';

    constructor() {
        this.id = getId();
    }
}