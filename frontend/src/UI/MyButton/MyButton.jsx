import classes from "./MyButton.module.css";

export default function MyButton({ className, children, ...props }) {
  return (
    <button className={`${classes.myBtn} ${className}`} {...props}>
      {children}
    </button>
  );
}
