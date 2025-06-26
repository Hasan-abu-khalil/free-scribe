// translate.worker.js
import { pipeline, env } from "@xenova/transformers";

// ✅ Configure Transformers.js to use local files only
env.allowRemoteModels = false;
env.localModelPath = "/models"; // Must match your Vite `public/models` path

class TranslationPipeline {
  static task = "translation";
  static model = "Xenova/nllb-200-distilled-600M";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
        cache_dir: "/models",
      });
    }
    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  try {
    const translator = await TranslationPipeline.getInstance((x) => {
      self.postMessage({ status: "progress", ...x });
    });

    const { text, src_lang, tgt_lang } = event.data;

    const output = await translator(text, {
      src_lang,
      tgt_lang,
      callback_function: (x) => {
        const partial = translator.tokenizer.decode(x[0].output_token_ids, {
          skip_special_tokens: true,
        });

        self.postMessage({
          status: "update",
          output: partial,
        });
      },
    });

    self.postMessage({
      status: "complete",
      output,
    });
  } catch (err) {
    console.error("[Worker] Error in translation:", err);
    self.postMessage({ status: "error", error: err.message });
  }
});
