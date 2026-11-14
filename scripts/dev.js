import app from '../app.js';
const args=process.argv.slice(2), value=(key,fallback)=>{const i=args.indexOf(key);return i>=0?args[i+1]:fallback};
const port=Number(value('--port',process.env.PORT||3000));
const host=value('--host','0.0.0.0');
app.listen(port,host,()=>console.log(`BĐS Hàng Hiệu: http://${host}:${port}`));
