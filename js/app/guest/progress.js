export const progress = (() => {
  /**
   * @type {HTMLElement|null}
   */
  let info = null;

  /**
   * @type {HTMLElement|null}
   */
  let bar = null;

  let total = 0;
  let loaded = 0;
  let valid = true;

  const log = (...args) => console.log("[progress]", ...args); // for debugging

  /**
   * @returns {void}
   */
  const add = () => {
    total += 1;
    log(`Added: total = ${total}`);
  };

  /**
   * @returns {string}
   */
  const showInformation = () => {
    return `(${loaded}/${total}) [${parseInt((loaded / total) * 100).toFixed(
      0
    )}%]`;
  };

  /**
   * @param {string} type
   * @param {boolean} [skip=false]
   * @returns {void}
   */
  const complete = (type, skip = false) => {
    if (!valid) return;

    loaded += 1;
    if (info && bar) {
      info.innerText = `Loading ${type} ${
        skip ? "skipped" : "complete"
      } ${showInformation()}`;
      bar.style.width = Math.min((loaded / total) * 100, 100).toString() + "%";
    }

    log(`Completed: ${type} (${loaded}/${total})`);

    if (loaded === total) {
      log("Dispatching progress.done");
      document.dispatchEvent(new Event("progress.done"));
    }
  };

  /**
   * @param {string} type
   * @returns {void}
   */
  const invalid = (type) => {
    if (valid) {
      valid = false;
      if (bar) bar.style.backgroundColor = "red";
      if (info) info.innerText = `Error loading ${type} ${showInformation()}`;
      log(`Invalid: ${type}`);
      document.dispatchEvent(new Event("progress.invalid"));
    }
  };

  /**
   * @returns {void}
   */
  const init = () => {
    info = document.getElementById("progress-info");
    bar = document.getElementById("progress-bar");

    if (!info || !bar) {
      console.error("[progress] Elements not found");
      return;
    }

    info.classList.remove("d-none");
    void info.offsetWidth; // Force reflow (iOS fix)
    log("Initialized progress bar");
  };

  return {
    init,
    add,
    invalid,
    complete,
  };
})();

// SAFE INIT: Wait for DOM to be fully ready
document.addEventListener("DOMContentLoaded", () => {
  progress.init();

  // Example usage:
  progress.add();
  progress.add();

  setTimeout(() => progress.complete("Asset A"), 1000);
  setTimeout(() => progress.complete("Asset B"), 2000);
});

// Listen for done
document.addEventListener("progress.done", () => {
  console.log("All assets loaded — continue to next screen");
  // Do navigation or next step here
});
