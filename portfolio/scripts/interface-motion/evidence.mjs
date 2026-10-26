// Editorial emphasis on existing published rows only. No values, events, packets or results change.
const ROWS={splunk:1-117/426,wazuh:1-506/634,wireshark:1-1040/1751};
export function evidenceMotion(material,id){
 if(!(id in ROWS))return null;
 const uniforms={focus:{value:0},sweep:{value:0},row:{value:ROWS[id]}};
 material.onBeforeCompile=shader=>{
  shader.uniforms.uEvidenceFocus=uniforms.focus;shader.uniforms.uEvidenceSweep=uniforms.sweep;shader.uniforms.uEvidenceRow=uniforms.row;
  shader.fragmentShader='uniform float uEvidenceFocus;uniform float uEvidenceSweep;uniform float uEvidenceRow;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    float rowLine = 1.0-smoothstep(0.0006,0.0033,abs(vMapUv.y-uEvidenceRow));
    float sweepLight = exp(-pow((vMapUv.x-uEvidenceSweep)/0.18,2.0));
    float amount = rowLine*uEvidenceFocus*(0.035+0.045*sweepLight);
    diffuseColor.rgb = mix(diffuseColor.rgb,vec3(0.55,0.73,0.62),amount);
  `);
 };
 material.customProgramCacheKey=()=>`published-evidence-row-v1`;
 return {update(state){const active=state.project.id===id&&state.opacity>.3;const p=Math.min(1,Math.max(0,(state.local-.65)/2.6));uniforms.focus.value=active?Math.sin(Math.PI*p)**2:0;uniforms.sweep.value=-.1+p*1.2;},kind:'editorial emphasis on unchanged historical evidence'};
}
