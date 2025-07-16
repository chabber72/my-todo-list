const icons = ["square"] as const;
type icon = (typeof icons)[number];

type IconProps = {
  name: icon;
};

console.log("Available icons:", icons);

export function Icon({ name }: IconProps) {
  let svg: React.ReactElement;

  switch (name) {
    case "square":
      svg = (
        <svg
          height="1rem"
          width="1rem"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 10.334 10.334"
          xmlSpace="preserve"
        >
          <g>
            <path
              style={{ fill: "#FFFFFF" }}
              d="M10.333,9.816c0,0.285-0.231,0.518-0.517,0.518H0.517C0.233,10.334,0,10.102,0,9.816V0.517
		C0,0.232,0.231,0,0.517,0h9.299c0.285,0,0.517,0.231,0.517,0.517V9.816z"
            />
          </g>
        </svg>
      );
      break;
  }

  return svg;
}
