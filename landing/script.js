function contactUs() {
  window.location.href = "mailto:nikhil.nixel@gmail.com?subject=Contact%20Request%20from%20Landing%20Page";
}

function goToGithub() {
  // open the GitHub repository in a new tab
  window.open("https://github.com/NikhilCodes/Opal", "_blank");
}

document.getElementById('copy-btn').onclick = function () {
  const text = document.getElementsByClassName('cmd-text');
  let fullText = '';
  for (let i = 0; i < text.length; i++) {
    fullText += text[i].textContent + '\n';
  }
  navigator.clipboard.writeText(fullText);

  const copyButton = document.getElementById('copy-btn');
  const existingContent = copyButton.innerHTML;
  copyButton.textContent = 'Copied!';
  // disabled
  copyButton.disabled = true;
  setTimeout(() => {
    copyButton.innerHTML = existingContent;
    copyButton.disabled = false;
  }, 2000);
};