import { Component } from "../../../../core/ecs/Component";

export type AppearanceComponentProps = {
  background: string;
};

export class AppearanceComponent extends Component {
  static DEFAULT_BACKGROUND = "#000000" as const;
  background: string = AppearanceComponent.DEFAULT_BACKGROUND;

  constructor(props: AppearanceComponentProps) {
    super();
    Object.assign(this, props);
  }
}
