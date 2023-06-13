import { ButtonHTMLAttributes } from "react";

type buttonPropsType = Required<
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "title" | "role">
> &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "onClick">;

export interface IButtonProps extends buttonPropsType {
  role: "submit" | "button" | "link";
  size?: "squared" | "full";
  variant?: "transparent";
}