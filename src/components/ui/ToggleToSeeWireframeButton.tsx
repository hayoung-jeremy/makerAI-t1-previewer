import { useWireframeStore } from "../../store";
import { cls } from "../../utils";

const ToggleToSeeWireframeButton = () => {
  const { toggleToSeeWireframe, setToggleToSeeWireframe } = useWireframeStore();
  return (
    <button
      onClick={() => setToggleToSeeWireframe(!toggleToSeeWireframe)}
      className={cls(
        "w-[52px] h-[52px] flex items-center justify-center border rounded-full cursor-pointer",
        "bg-white/5 backdrop-blur-sm",
        "",
        "transition-all duration-200",
        toggleToSeeWireframe
          ? "border-white text-white"
          : "border-white/0 text-white/40 hover:border-white/60 hover:text-white/60"
      )}
    >
      <svg height={24} width={24} fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.8594 12.735L16 14.9143L20.1405 12.735"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path d="M3.18945 8.17188L8.0984 10.7555" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M28.8105 8.17188L23.9016 10.7555" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M16 1.33333V7.15112" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M16 14.9388V19.9263" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M16 25.1702V30.88" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path
          d="M3.18945 18.8869V24.2657L7.99984 26.7974"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path d="M8.09766 21.6631L3.18871 24.2467" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M23.9023 21.6631L28.8113 24.2467" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path
          d="M7.99984 5.55208L3.18945 8.08386V13.7961"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M11.5547 3.68165L16.001 1.34148L20.4473 3.68165"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path d="M24 5.55208L28.8104 8.08386V13.7961" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path d="M28.8104 18.8869V24.2656L24 26.7974" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
        <path
          d="M11.5547 28.5231L16.001 30.8633L20.4473 28.5231"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
};

export default ToggleToSeeWireframeButton;
