var A=function(t,a){t=t||1,a=a||2;for(var h=t*2+1,w=Math.pow(h,a)-1,o=new Array(w),r=0;r<w;r++)for(var M=o[r]=new Array(a),p=r<w/2?r:r+1,v=1;v<=a;v++){var f=p%Math.pow(h,v);M[v-1]=f/Math.pow(h,v-1)-t,p-=f}return o};export{A as m};
