function Loading({ fullscreen = false, text }) {
  const content = (
    <>
      <div className="spinner" />
      {text && <div>{text}</div>}
    </>
  );

  if (fullscreen) {
    return <div className="loading-overlay">{content}</div>;
  }

  return content;
}

export default Loading;
