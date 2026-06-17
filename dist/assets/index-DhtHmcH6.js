(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();function i(r,n){const a=(n%26+26)%26;return r.replace(/[a-z]/gi,o=>{const e=o===o.toUpperCase()?65:97,s=(o.charCodeAt(0)-e+a)%26;return String.fromCharCode(e+s)})}document.addEventListener("DOMContentLoaded",()=>{const r=document.createElement("main");r.className="app-shell",r.innerHTML=`
		<section class="hero-card">
			<p class="eyebrow">Live Caesar shift</p>
			<h1>Reverence</h1>
			<p class="lede">Type text, move the shift, and the encoded output updates immediately.</p>

			<label class="field">
				<span>Input text</span>
				<textarea id="inputText" rows="5" placeholder="Enter text to shift"></textarea>
			</label>

			<label class="field slider-field" for="shiftValue">
				<div class="field-header">
					<span>Shift amount</span>
					<output id="shiftLabel">3</output>
				</div>
				<input id="shiftValue" type="range" min="0" max="25" value="3" />
			</label>

			<label class="field">
				<span>Output text</span>
				<textarea id="outputText" rows="5" readonly></textarea>
			</label>
		</section>
	`,document.body.innerHTML="",document.body.appendChild(r);const n=document.getElementById("inputText"),a=document.getElementById("shiftValue"),o=document.getElementById("shiftLabel"),e=document.getElementById("outputText"),t=()=>{const s=Number(a.value);o.textContent=s,e.value=i(n.value,s)};n.addEventListener("input",t),a.addEventListener("input",t),t()});
