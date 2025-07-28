console.log("✅ runner.js is executing...");

import { processCollection } from './challenge1bProcessor.js';

(async () => {
  try {
    console.log('Starting document processing...');
    await processCollection('/app/input'); // Updated path for Docker
    console.log('✅ Processing completed successfully');
  } catch (err) {
    console.error('❌ Fatal error during processing:', err.message);
    process.exit(1);
  }
})();