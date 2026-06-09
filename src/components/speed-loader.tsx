/** Uiverse speeder loader — themed via CSS variables. */
export function SpeedLoader({ fullScreen = true }: { fullScreen?: boolean }) {
  return (
    <div className={fullScreen ? "speed-loader-screen" : "speed-loader-inline"}>
      <div className="loader">
        <span><span /><span /><span /><span /></span>
        <div className="base">
          <span />
          <div className="face" />
        </div>
      </div>
      <div className="longfazers">
        <span /><span /><span /><span />
      </div>
    </div>
  );
}
