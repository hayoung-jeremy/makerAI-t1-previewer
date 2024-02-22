interface Props {
  waitingCount: number;
}

const WaitingForQueue = ({ waitingCount }: Props) => {
  return (
    <>
      <p className="" style={{ textShadow: "0px 0px 8px #ffffff80" }}>
        Waiting for previous work...
      </p>
      <span className="text-[#acacac] text-[14px] md:text-[18px] xl:text-[24px] ">
        Expected Waiting Time :{" "}
        <span
          className={waitingCount > 0 ? "text-yellow-300" : "text-gray-500"}
          style={{ textShadow: waitingCount > 0 ? "0px 0px 8px rgba(253,224,71,0.8)" : "" }}
        >
          {waitingCount * 3} hours
        </span>
      </span>
      <span className="text-[#acacac] text-[14px] md:text-[18px] xl:text-[24px]">
        Remaining Queue Before Your Turn :{" "}
        <span
          className={waitingCount > 0 ? "text-yellow-300" : "text-gray-500"}
          style={{ textShadow: waitingCount > 0 ? "0px 0px 8px rgba(253,224,71,0.8)" : "" }}
        >
          {waitingCount}
        </span>
      </span>
    </>
  );
};

export default WaitingForQueue;
