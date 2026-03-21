import { getId } from "../../utils/getId";
import type { Unique } from "./Unique";

export abstract class Component implements Unique {
    id = '';

    constructor() {
        this.id = getId();
    }
}