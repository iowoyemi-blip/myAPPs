(() => {
  const form = document.getElementById("countdown-form");
  const status = document.getElementById("status");
  const display = document.getElementById("countdown");

  let ticker = null;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const startValue = form.start.value;
    const endValue = form.end.value;

    if (!startValue || !endValue) {
      status.textContent = "Please pick both dates to begin.";
      display.textContent = "";
      return;
    }

    const startTime = new Date(startValue);
    const endTime = new Date(endValue);

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      status.textContent = "One of the dates is invalid. Please try again.";
      display.textContent = "";
      return;
    }

    if (endTime <= startTime) {
      status.textContent = "End date must be after the start date.";
      display.textContent = "";
      return;
    }

    if (ticker) {
      clearInterval(ticker);
    }

    // Update immediately so the user sees feedback without waiting for the first tick.
    updateCountdown(startTime, endTime);
    ticker = setInterval(() => updateCountdown(startTime, endTime), 1000);
  });

  function updateCountdown(startTime, endTime) {
    const now = new Date();

    if (now >= endTime) {
      clearInterval(ticker);
      ticker = null;
      status.textContent = "Countdown finished.";
      display.innerHTML = buildTemplate(0, 0, 0, 0);
      return;
    }

    if (now < startTime) {
      const diff = computeParts(startTime - now);
      status.textContent = "Countdown begins in:";
      display.innerHTML = buildTemplate(diff.days, diff.hours, diff.minutes, diff.seconds);
      return;
    }

    const diff = computeParts(endTime - now);
    status.textContent = "Time remaining:";
    display.innerHTML = buildTemplate(diff.days, diff.hours, diff.minutes, diff.seconds);
  }

  function computeParts(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }

  function buildTemplate(days, hours, minutes, seconds) {
    return [
      `<span>${pad(days)}d</span>`,
      `<span>${pad(hours)}h</span>`,
      `<span>${pad(minutes)}m</span>`,
      `<span>${pad(seconds)}s</span>`
    ].join(" ");
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }
})();
