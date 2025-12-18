export interface AITool {
  id: string
  name: string
  description: string
  category: 'Text' | 'Image' | 'Video' | 'Audio' | 'Coding' | 'Business' | 'Productivity' | 'Unrestricted' | 'Research' | 'Design' | 'Other'
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Open Source' | 'Trial'
  url: string
  tags: string[]
  bestFor: string
}

export const aiTools: AITool[] = [
  // --- Unrestricted / Local / Open Source ---
  {
    id: 'lm-studio',
    name: 'LM Studio',
    description: 'Run LLMs locally on your own hardware. Discover, download, and run local LLMs like Llama, Mistral, and more.',
    category: 'Unrestricted',
    pricing: 'Free',
    url: 'https://lmstudio.ai',
    tags: ['local', 'llm', 'offline', 'uncensored'],
    bestFor: 'Running uncensored models privately'
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Get up and running with large language models locally. Simple, command-line based.',
    category: 'Unrestricted',
    pricing: 'Free',
    url: 'https://ollama.ai',
    tags: ['local', 'llm', 'cli', 'open-source'],
    bestFor: 'Developers running local models'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'The platform where the machine learning community collaborates on models, datasets, and applications.',
    category: 'Unrestricted',
    pricing: 'Free',
    url: 'https://huggingface.co',
    tags: ['platform', 'models', 'datasets', 'research'],
    bestFor: 'Finding any open-source model'
  },
  {
    id: 'civitai',
    name: 'Civitai',
    description: 'The home for Stable Diffusion models. Browse and download thousands of custom, unrestricted image generation models.',
    category: 'Unrestricted',
    pricing: 'Free',
    url: 'https://civitai.com',
    tags: ['image', 'models', 'stable diffusion', 'uncensored'],
    bestFor: 'Custom image generation models'
  },
  {
    id: 'stable-diffusion-webui',
    name: 'Stable Diffusion WebUI (A1111)',
    description: 'The standard interface for running Stable Diffusion locally. Infinite customization and control.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
    tags: ['image', 'local', 'advanced', 'uncensored'],
    bestFor: 'Power users generating images'
  },
  {
    id: 'gpt4all',
    name: 'GPT4All',
    description: 'A free-to-use, locally running, privacy-aware chatbot. No GPU or internet required.',
    category: 'Unrestricted',
    pricing: 'Free',
    url: 'https://gpt4all.io',
    tags: ['local', 'chat', 'privacy', 'cpu'],
    bestFor: 'Privacy-focused local chat'
  },
  {
    id: 'oobabooga',
    name: 'Text Gen WebUI (Oobabooga)',
    description: 'A Gradio web UI for running Large Language Models like Llama, GPT-J, Pythia, OPT, and GALACTICA.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/oobabooga/text-generation-webui',
    tags: ['local', 'llm', 'advanced', 'customizable'],
    bestFor: 'Advanced local LLM configuration'
  },
  {
    id: 'koboldcpp',
    name: 'KoboldCPP',
    description: 'A simple way to run GGML and GGUF models locally. Focused on storytelling and roleplay.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/LostRuins/koboldcpp',
    tags: ['roleplay', 'storytelling', 'local', 'llm'],
    bestFor: 'AI roleplay and fiction'
  },
  {
    id: 'pinokio',
    name: 'Pinokio',
    description: 'A browser that lets you install, run, and program any AI application automatically.',
    category: 'Unrestricted',
    pricing: 'Free',
    url: 'https://pinokio.computer',
    tags: ['browser', 'installer', 'easy', 'local'],
    bestFor: 'One-click install of complex AI tools'
  },
  {
    id: 'fooocus',
    name: 'Fooocus',
    description: 'Image generating software based on Gradio. Focuses on being easy to use like Midjourney but free and local.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/lllyasviel/Fooocus',
    tags: ['image', 'easy', 'local', 'midjourney-alternative'],
    bestFor: 'Easy local image generation'
  },
  {
    id: 'comfyui',
    name: 'ComfyUI',
    description: 'The most powerful and modular stable diffusion GUI. Node-based workflow for absolute control.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/comfyanonymous/ComfyUI',
    tags: ['image', 'nodes', 'advanced', 'workflow'],
    bestFor: 'Complex image workflows'
  },
  {
    id: 'jan',
    name: 'Jan',
    description: 'Turn your computer into an AI machine. Open source alternative to ChatGPT that runs 100% offline.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://jan.ai',
    tags: ['local', 'chat', 'offline', 'privacy'],
    bestFor: 'Offline ChatGPT alternative'
  },
  {
    id: 'localai',
    name: 'LocalAI',
    description: 'The free, Open Source OpenAI alternative. Drop-in replacement REST API for local inference.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://localai.io',
    tags: ['api', 'developer', 'local', 'server'],
    bestFor: 'Developers needing local API'
  },
  {
    id: 'open-interpreter',
    name: 'Open Interpreter',
    description: 'A natural language interface for computers. Lets language models run code on your computer to complete tasks.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://openinterpreter.com',
    tags: ['agent', 'automation', 'cli', 'code'],
    bestFor: 'Controlling your OS with AI'
  },
  {
    id: 'metavoice',
    name: 'MetaVoice',
    description: 'Open source foundation model for speech. High quality TTS that you can run yourself.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://themetavoice.xyz',
    tags: ['voice', 'tts', 'local', 'audio'],
    bestFor: 'Local voice generation'
  },

  // --- Text & Writing ---
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    description: 'The most popular conversational AI. Great for brainstorming, drafting, coding, and general assistance.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://chat.openai.com',
    tags: ['chatbot', 'llm', 'writing', 'coding'],
    bestFor: 'General purpose assistance'
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    description: 'Known for its large context window and natural, safe conversational abilities. Excellent for long documents.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://claude.ai',
    tags: ['chatbot', 'llm', 'analysis', 'writing'],
    bestFor: 'Processing long documents'
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    description: 'Google’s most capable AI model. Multimodal reasoning across text, images, video, audio, and code.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://gemini.google.com',
    tags: ['multimodal', 'google', 'research'],
    bestFor: 'Google ecosystem integration'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'AI-powered search engine. Provides concise answers with citations from the web.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://www.perplexity.ai',
    tags: ['search', 'research', 'citations'],
    bestFor: 'Accurate research & searching'
  },
  {
    id: 'microsoft-copilot',
    name: 'Microsoft Copilot',
    description: 'Your everyday AI companion. Integrated into Windows and Microsoft 365.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://copilot.microsoft.com',
    tags: ['productivity', 'office', 'search'],
    bestFor: 'Windows & Office users'
  },
  {
    id: 'poe',
    name: 'Poe',
    description: 'Fast, helpful AI chat. Access multiple models (Claude, GPT-4, etc.) in one place.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://poe.com',
    tags: ['aggregator', 'chat', 'mobile'],
    bestFor: 'Comparing different models'
  },
  {
    id: 'mistral-le-chat',
    name: 'Mistral Le Chat',
    description: 'Conversational AI from Mistral AI. Highly capable open-weight models available via chat.',
    category: 'Text',
    pricing: 'Free',
    url: 'https://chat.mistral.ai',
    tags: ['chat', 'open-weights', 'european'],
    bestFor: 'High quality alternative LLMs'
  },
  {
    id: 'huggingchat',
    name: 'HuggingChat',
    description: 'Open source alternative to ChatGPT. Powered by open models like Llama 3 and Mistral.',
    category: 'Text',
    pricing: 'Free',
    url: 'https://huggingface.co/chat',
    tags: ['chat', 'open-source', 'free'],
    bestFor: 'Free open source chat'
  },
  {
    id: 'jasper',
    name: 'Jasper',
    description: 'AI writer built specifically for marketing and enterprise content creation.',
    category: 'Text',
    pricing: 'Paid',
    url: 'https://www.jasper.ai',
    tags: ['marketing', 'copywriting', 'seo'],
    bestFor: 'Marketing teams'
  },
  {
    id: 'copyai',
    name: 'Copy.ai',
    description: 'Easy-to-use copywriting tool for social media, blogs, and ads.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://www.copy.ai',
    tags: ['copywriting', 'social media', 'marketing'],
    bestFor: 'Social media content'
  },
  {
    id: 'writesonic',
    name: 'Writesonic',
    description: 'AI writer that creates SEO-friendly content for blogs, Facebook ads, Google ads, and Shopify.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://writesonic.com',
    tags: ['seo', 'blogging', 'ads'],
    bestFor: 'SEO articles'
  },
  {
    id: 'rytr',
    name: 'Rytr',
    description: 'An AI writing assistant that helps you create high-quality content, in just a few seconds.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://rytr.me',
    tags: ['writing', 'budget', 'simple'],
    bestFor: 'Budget-friendly writing'
  },
  {
    id: 'sudowrite',
    name: 'Sudowrite',
    description: 'The non-judgmental, always-there AI partner for creative writers and novelists.',
    category: 'Text',
    pricing: 'Paid',
    url: 'https://www.sudowrite.com',
    tags: ['fiction', 'novel', 'creative'],
    bestFor: 'Writing fiction books'
  },
  {
    id: 'quillbot',
    name: 'Quillbot',
    description: 'AI-powered paraphrasing tool. Enhances your writing by rewriting sentences.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://quillbot.com',
    tags: ['paraphrasing', 'grammar', 'academic'],
    bestFor: 'Rewriting & polishing'
  },
  {
    id: 'wordtune',
    name: 'Wordtune',
    description: 'Your personal writing companion. Rewrites, summarizes, and helps you say exactly what you mean.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://www.wordtune.com',
    tags: ['rewrite', 'email', 'browser-extension'],
    bestFor: 'Quick email improvements'
  },
  {
    id: 'lex',
    name: 'Lex',
    description: 'A word processor with AI baked in. Clean, minimal, and powerful.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://lex.page',
    tags: ['editor', 'writing', 'minimal'],
    bestFor: 'Distraction-free writing'
  },
  {
    id: 'novelai',
    name: 'NovelAI',
    description: 'AI-assisted authorship, storytelling, and virtual companionship.',
    category: 'Text',
    pricing: 'Paid',
    url: 'https://novelai.net',
    tags: ['storytelling', 'fiction', 'image-gen'],
    bestFor: 'Storytellers & authors'
  },

  // --- Image Generation ---
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'The gold standard for artistic and photorealistic AI image generation. Operates via Discord.',
    category: 'Image',
    pricing: 'Paid',
    url: 'https://www.midjourney.com',
    tags: ['art', 'photorealism', 'creative'],
    bestFor: 'High-quality artistic visuals'
  },
  {
    id: 'dalle3',
    name: 'DALL-E 3',
    description: 'OpenAI’s image generator, integrated into ChatGPT. Great for following complex prompts.',
    category: 'Image',
    pricing: 'Paid',
    url: 'https://openai.com/dall-e-3',
    tags: ['easy', 'chatgpt-integrated', 'creative'],
    bestFor: 'Exact instruction following'
  },
  {
    id: 'stablediffusion-stability',
    name: 'Stable Diffusion (DreamStudio)',
    description: 'Official web app for Stability AI models. Fast and high quality generation.',
    category: 'Image',
    pricing: 'Paid',
    url: 'https://dreamstudio.ai',
    tags: ['fast', 'stable-diffusion', 'web'],
    bestFor: 'Quick SD generations'
  },
  {
    id: 'leonardo',
    name: 'Leonardo.ai',
    description: 'A comprehensive platform for creating game assets and artistic illustrations with fine-tuned models.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://leonardo.ai',
    tags: ['game assets', 'art', 'platform'],
    bestFor: 'Game developers & designers'
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    description: 'AI image generator specializing in reliable text rendering within images.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://ideogram.ai',
    tags: ['typography', 'text-in-image', 'logos'],
    bestFor: 'Images containing text/logos'
  },
  {
    id: 'adobe-firefly',
    name: 'Adobe Firefly',
    description: 'Generative AI integrated into Photoshop and available on the web. Safe for commercial use.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://firefly.adobe.com',
    tags: ['commercial-safe', 'design', 'adobe'],
    bestFor: 'Commercial design work'
  },
  {
    id: 'canva',
    name: 'Canva Magic Studio',
    description: 'AI design tools integrated into the popular design platform. Magic Edit, Magic Write, etc.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://www.canva.com',
    tags: ['design', 'easy', 'marketing'],
    bestFor: 'Non-designers needing quick graphics'
  },
  {
    id: 'krea',
    name: 'Krea',
    description: 'Real-time AI image generation and enhancement. Draw and see results instantly.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://www.krea.ai',
    tags: ['real-time', 'upscaling', 'video'],
    bestFor: 'Instant visualization & upscaling'
  },
  {
    id: 'clipdrop',
    name: 'Clipdrop',
    description: 'Suite of AI tools by Stability AI. Remove backgrounds, relight images, uncrop, and more.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://clipdrop.co',
    tags: ['editing', 'tools', 'cleanup'],
    bestFor: 'Photo manipulation & cleanup'
  },
  {
    id: 'magnific',
    name: 'Magnific AI',
    description: 'The most advanced AI upscaler and enhancer. Adds incredible detail to images.',
    category: 'Image',
    pricing: 'Paid',
    url: 'https://magnific.ai',
    tags: ['upscaler', 'detail', 'enhancement'],
    bestFor: 'Upscaling low-res images'
  },
  {
    id: 'seaart',
    name: 'SeaArt',
    description: 'Powerful AI art generator with many models and LoRAs available for free.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://www.seaart.ai',
    tags: ['anime', 'models', 'free-tiers'],
    bestFor: 'Anime & stylized art'
  },
  {
    id: 'tensor-art',
    name: 'Tensor.art',
    description: 'Free online AI image generator and model hosting platform.',
    category: 'Image',
    pricing: 'Free',
    url: 'https://tensor.art',
    tags: ['free', 'models', 'hosting'],
    bestFor: 'Free generation with custom models'
  },

  // --- Video Creation ---
  {
    id: 'runway',
    name: 'Runway',
    description: 'Advanced video generation (Gen-2, Gen-3 Alpha) and editing tools.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://runwayml.com',
    tags: ['video gen', 'editing', 'vfx'],
    bestFor: 'Creative video generation'
  },
  {
    id: 'pika',
    name: 'Pika',
    description: 'AI platform for making videos. Known for animation quality and ease of use.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://pika.art',
    tags: ['animation', 'video gen', 'social'],
    bestFor: 'Social media clips & animation'
  },
  {
    id: 'luma-dream-machine',
    name: 'Luma Dream Machine',
    description: 'High quality video generation model. Creates realistic 5-second clips fast.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://lumalabs.ai/dream-machine',
    tags: ['video gen', 'realistic', 'fast'],
    bestFor: 'Realistic video clips'
  },
  {
    id: 'sora',
    name: 'Sora (OpenAI)',
    description: 'Text-to-video model capable of highly detailed scenes. (Currently limited access).',
    category: 'Video',
    pricing: 'Trial',
    url: 'https://openai.com/sora',
    tags: ['video gen', 'realistic', 'hype'],
    bestFor: 'Cutting edge video (if available)'
  },
  {
    id: 'heygen',
    name: 'HeyGen',
    description: 'Create professional AI spokesperson videos. Turn text into a talking avatar.',
    category: 'Video',
    pricing: 'Paid',
    url: 'https://www.heygen.com',
    tags: ['avatars', 'presentation', 'marketing'],
    bestFor: 'Marketing & training videos'
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    description: 'AI video creation platform. Create videos with AI avatars in over 120 languages.',
    category: 'Video',
    pricing: 'Paid',
    url: 'https://www.synthesia.io',
    tags: ['avatars', 'multilingual', 'corporate'],
    bestFor: 'Corporate training & localization'
  },
  {
    id: 'descript',
    name: 'Descript',
    description: 'All-in-one video and audio editor that lets you edit media by editing the text transcript.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://www.descript.com',
    tags: ['editing', 'transcription', 'podcasting'],
    bestFor: 'Video/Podcast editing'
  },
  {
    id: 'opus-clip',
    name: 'Opus Clip',
    description: 'Repurpose long videos into shorts in one click. Great for podcasts and interviews.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://www.opus.pro',
    tags: ['repurposing', 'shorts', 'tiktok'],
    bestFor: 'Creating viral shorts'
  },
  {
    id: 'invideo',
    name: 'InVideo AI',
    description: 'Generate full videos with stock footage, voiceovers, and subtitles from a single prompt.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://invideo.io',
    tags: ['video-creation', 'marketing', 'youtube'],
    bestFor: 'Faceless YouTube channels'
  },
  {
    id: 'captions',
    name: 'Captions',
    description: 'AI-powered video editing app for creators. Auto-captions, eye contact correction, and dubbing.',
    category: 'Video',
    pricing: 'Paid',
    url: 'https://www.captions.ai',
    tags: ['social', 'mobile', 'editing'],
    bestFor: 'Talking head videos'
  },
  {
    id: 'kaiber',
    name: 'Kaiber',
    description: 'AI creative lab for animation and video transformation. Used by musicians for music videos.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://kaiber.ai',
    tags: ['animation', 'style-transfer', 'music'],
    bestFor: 'Stylized music videos'
  },

  // --- Coding ---
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer. Suggests code and entire functions in real-time.',
    category: 'Coding',
    pricing: 'Paid',
    url: 'https://github.com/features/copilot',
    tags: ['autocomplete', 'ide-integrated', 'developer'],
    bestFor: 'Speeding up development'
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'An AI-first code editor. Built to code with you, offering chat, diffs, and codebase understanding.',
    category: 'Coding',
    pricing: 'Freemium',
    url: 'https://cursor.sh',
    tags: ['editor', 'ide', 'chat'],
    bestFor: 'Deep codebase integration'
  },
  {
    id: 'replit',
    name: 'Replit AI',
    description: 'AI integrated into the Replit online IDE. Generate, debug, and explain code in the browser.',
    category: 'Coding',
    pricing: 'Paid',
    url: 'https://replit.com',
    tags: ['online-ide', 'collaborative', 'learning'],
    bestFor: 'Browser-based coding'
  },
  {
    id: 'codeium',
    name: 'Codeium',
    description: 'Free AI code completion and chat. Works in VS Code, JetBrains, and many others.',
    category: 'Coding',
    pricing: 'Free',
    url: 'https://codeium.com',
    tags: ['autocomplete', 'free', 'plugin'],
    bestFor: 'Free alternative to Copilot'
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    description: 'AI assistant for software developers. Highly secure and offers private deployments.',
    category: 'Coding',
    pricing: 'Freemium',
    url: 'https://www.tabnine.com',
    tags: ['security', 'enterprise', 'autocomplete'],
    bestFor: 'Enterprise security requirements'
  },
  {
    id: 'cody',
    name: 'Sourcegraph Cody',
    description: 'AI coding assistant that knows your entire codebase. Search and understand code fast.',
    category: 'Coding',
    pricing: 'Freemium',
    url: 'https://sourcegraph.com/cody',
    tags: ['search', 'context', 'explanation'],
    bestFor: 'Understanding large codebases'
  },
  {
    id: 'devin',
    name: 'Devin (Cognition)',
    description: 'The first fully autonomous AI software engineer. Can plan and execute complex engineering tasks.',
    category: 'Coding',
    pricing: 'Trial',
    url: 'https://www.cognition-labs.com',
    tags: ['agent', 'autonomous', 'advanced'],
    bestFor: 'Autonomous engineering tasks'
  },
  {
    id: 'blackbox',
    name: 'Blackbox AI',
    description: 'AI coding assistant built to answer coding questions and help you write code faster.',
    category: 'Coding',
    pricing: 'Freemium',
    url: 'https://www.blackbox.ai',
    tags: ['chat', 'snippets', 'learning'],
    bestFor: 'Quick coding answers'
  },

  // --- Audio & Voice ---
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'The most realistic AI voice generator. Text-to-speech with incredible emotion and cloning capabilities.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://elevenlabs.io',
    tags: ['voice-cloning', 'tts', 'dubbing'],
    bestFor: 'Realistic voiceovers'
  },
  {
    id: 'suno',
    name: 'Suno',
    description: 'Generate full songs with vocals and lyrics from a simple text prompt.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://suno.com',
    tags: ['music', 'songs', 'creative'],
    bestFor: 'Creating complete songs'
  },
  {
    id: 'udio',
    name: 'Udio',
    description: 'High-fidelity AI music generation. Create complex musical compositions.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://www.udio.com',
    tags: ['music', 'production', 'high-fidelity'],
    bestFor: 'High quality music tracks'
  },
  {
    id: 'murf',
    name: 'Murf.ai',
    description: 'Versatile AI voice generator. Great for e-learning, presentations, and voiceovers.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://murf.ai',
    tags: ['voiceover', 'presentation', 'tts'],
    bestFor: 'Professional presentations'
  },
  {
    id: 'playht',
    name: 'Play.ht',
    description: 'AI Text to Speech generator. Realistic AI Voice Generator & Audio cloning.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://play.ht',
    tags: ['tts', 'cloning', 'podcasting'],
    bestFor: 'High volume TTS'
  },
  {
    id: 'speechify',
    name: 'Speechify',
    description: 'The leading text-to-speech app. Listen to documents, articles, and PDFs.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://speechify.com',
    tags: ['reading', 'accessibility', 'productivity'],
    bestFor: 'Listening to text'
  },
  {
    id: 'resemble',
    name: 'Resemble AI',
    description: 'Clones voices from your data to create immersive experiences.',
    category: 'Audio',
    pricing: 'Paid',
    url: 'https://www.resemble.ai',
    tags: ['cloning', 'security', 'enterprise'],
    bestFor: 'Custom brand voices'
  },
  {
    id: 'riffusion',
    name: 'Riffusion',
    description: 'Generate music from text prompts using real-time audio diffusion.',
    category: 'Audio',
    pricing: 'Free',
    url: 'https://www.riffusion.com',
    tags: ['music', 'experimental', 'generation'],
    bestFor: 'Short musical loops'
  },
  {
    id: 'adobe-podcast',
    name: 'Adobe Podcast',
    description: 'AI audio recording and editing. "Enhance Speech" makes bad mics sound professional.',
    category: 'Audio',
    pricing: 'Free',
    url: 'https://podcast.adobe.com',
    tags: ['cleanup', 'enhancement', 'recording'],
    bestFor: 'Fixing bad audio quality'
  },

  // --- Productivity & Business ---
  {
    id: 'notion-ai',
    name: 'Notion AI',
    description: 'AI writing assistant integrated into Notion. Summarize, expand, and generate text.',
    category: 'Productivity',
    pricing: 'Paid',
    url: 'https://www.notion.so/product/ai',
    tags: ['notes', 'writing', 'organization'],
    bestFor: 'Notion users'
  },
  {
    id: 'otter',
    name: 'Otter.ai',
    description: 'AI meeting assistant. Records, transcribes, and summarizes meetings automatically.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://otter.ai',
    tags: ['meetings', 'transcription', 'notes'],
    bestFor: 'Meeting notes'
  },
  {
    id: 'fireflies',
    name: 'Fireflies.ai',
    description: 'Meeting recorder and transcriber that integrates with your conferencing tools.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://fireflies.ai',
    tags: ['meetings', 'transcription', 'crm'],
    bestFor: 'Team meeting intelligence'
  },
  {
    id: 'rewind',
    name: 'Rewind',
    description: 'A personalized AI that captures everything you see, say, and hear on your Mac.',
    category: 'Productivity',
    pricing: 'Paid',
    url: 'https://www.rewind.ai',
    tags: ['memory', 'mac', 'search'],
    bestFor: 'Remembering everything'
  },
  {
    id: 'mem',
    name: 'Mem',
    description: 'The self-organizing workspace. An AI note-taking app that links your thoughts.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://mem.ai',
    tags: ['notes', 'pkm', 'organization'],
    bestFor: 'Personal knowledge management'
  },
  {
    id: 'taskade',
    name: 'Taskade',
    description: 'AI-powered productivity platform for teams. Tasks, notes, mind maps, and video chat.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://www.taskade.com',
    tags: ['tasks', 'collaboration', 'mindmaps'],
    bestFor: 'Team collaboration'
  },
  {
    id: 'chatpdf',
    name: 'ChatPDF',
    description: 'Chat with any PDF. Summarize and answer questions from documents.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://www.chatpdf.com',
    tags: ['pdf', 'research', 'students'],
    bestFor: 'Reading papers fast'
  },
  {
    id: 'humata',
    name: 'Humata',
    description: 'AI for your files. Ask questions and get answers from your data.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://www.humata.ai',
    tags: ['pdf', 'analysis', 'enterprise'],
    bestFor: 'Analyzing long reports'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automation platform. Connect apps and use AI to build intelligent workflows.',
    category: 'Business',
    pricing: 'Freemium',
    url: 'https://zapier.com',
    tags: ['automation', 'workflow', 'integration'],
    bestFor: 'Connecting tools'
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    description: 'Visual automation platform. Build complex AI workflows visually.',
    category: 'Business',
    pricing: 'Freemium',
    url: 'https://www.make.com',
    tags: ['automation', 'visual', 'workflow'],
    bestFor: 'Complex automations'
  },
  {
    id: 'gamma',
    name: 'Gamma',
    description: 'Create beautiful presentations, documents, and websites with AI. Just type a topic.',
    category: 'Business',
    pricing: 'Freemium',
    url: 'https://gamma.app',
    tags: ['presentations', 'decks', 'design'],
    bestFor: 'Creating slide decks'
  },
  {
    id: 'tome',
    name: 'Tome',
    description: 'AI-powered storytelling format. Generates presentations and microsites.',
    category: 'Business',
    pricing: 'Freemium',
    url: 'https://tome.app',
    tags: ['storytelling', 'presentations', 'visuals'],
    bestFor: 'Creative pitches'
  },
  {
    id: 'beautiful-ai',
    name: 'Beautiful.ai',
    description: 'Presentation software that uses AI to design slides automatically.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://www.beautiful.ai',
    tags: ['presentations', 'design', 'corporate'],
    bestFor: 'Professional slides'
  },
  {
    id: 'adcreative',
    name: 'AdCreative.ai',
    description: 'Generate conversion-focused ad creatives and social media posts.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://www.adcreative.ai',
    tags: ['ads', 'marketing', 'conversion'],
    bestFor: 'Performance marketers'
  },
  {
    id: 'predis',
    name: 'Predis.ai',
    description: 'AI social media post generator. Creates creatives, captions, and hashtags.',
    category: 'Business',
    pricing: 'Freemium',
    url: 'https://predis.ai',
    tags: ['social media', 'instagram', 'automation'],
    bestFor: 'Social media managers'
  },
  
  // --- Research & 3D & Design ---
  {
    id: 'consensus',
    name: 'Consensus',
    description: 'AI search engine for research. Finds answers in scientific papers.',
    category: 'Research',
    pricing: 'Freemium',
    url: 'https://consensus.app',
    tags: ['science', 'papers', 'academic'],
    bestFor: 'Academic research'
  },
  {
    id: 'elicit',
    name: 'Elicit',
    description: 'AI research assistant. Automates research workflows like literature review.',
    category: 'Research',
    pricing: 'Freemium',
    url: 'https://elicit.com',
    tags: ['research', 'analysis', 'papers'],
    bestFor: 'Literature reviews'
  },
  {
    id: 'scite',
    name: 'Scite',
    description: 'Award-winning platform for discovering and evaluating scientific articles via Smart Citations.',
    category: 'Research',
    pricing: 'Paid',
    url: 'https://scite.ai',
    tags: ['citations', 'validity', 'science'],
    bestFor: 'Checking citations'
  },
  {
    id: 'scholarcy',
    name: 'Scholarcy',
    description: 'The AI-powered article summarizer. Reads research papers for you.',
    category: 'Research',
    pricing: 'Freemium',
    url: 'https://www.scholarcy.com',
    tags: ['summarization', 'flashcards', 'study'],
    bestFor: 'Skimming papers'
  },
  {
    id: 'luma-ai',
    name: 'Luma AI',
    description: 'Capture the world in lifelike 3D. Create 3D assets from videos.',
    category: 'Design',
    pricing: 'Free',
    url: 'https://lumalabs.ai',
    tags: ['3d', 'nerf', 'capture'],
    bestFor: '3D capture'
  },
  {
    id: 'spline',
    name: 'Spline AI',
    description: '3D design tool with AI integration. Generate 3D objects, textures, and animations.',
    category: 'Design',
    pricing: 'Freemium',
    url: 'https://spline.design/ai',
    tags: ['3d', 'web-design', 'animation'],
    bestFor: 'Web 3D elements'
  },
  {
    id: 'meshy',
    name: 'Meshy',
    description: 'Fast 3D AI generator. Text to 3D and Image to 3D.',
    category: 'Design',
    pricing: 'Freemium',
    url: 'https://www.meshy.ai',
    tags: ['3d', 'assets', 'game-dev'],
    bestFor: 'Game asset prototyping'
  },
  {
    id: 'uizard',
    name: 'Uizard',
    description: 'Design websites, apps, and UIs with AI. Text to design.',
    category: 'Design',
    pricing: 'Freemium',
    url: 'https://uizard.io',
    tags: ['ui', 'ux', 'prototyping'],
    bestFor: 'App prototyping'
  },
  {
    id: 'galileo',
    name: 'Galileo',
    description: 'Generative AI for interface design. Text to UI designs in Figma.',
    category: 'Design',
    pricing: 'Paid',
    url: 'https://www.usegalileo.ai',
    tags: ['ui', 'figma', 'mobile'],
    bestFor: 'Mobile app UI'
  },
  {
    id: 'visily',
    name: 'Visily',
    description: 'AI-powered wireframing and design tool. Screenshot to design.',
    category: 'Design',
    pricing: 'Free',
    url: 'https://www.visily.ai',
    tags: ['wireframe', 'ui', 'easy'],
    bestFor: 'Quick wireframes'
  },

  // --- More Unrestricted / Open Source ---
  {
    id: 'llama-cpp',
    name: 'llama.cpp',
    description: 'Port of Facebook\'s LLaMA model in C/C++. Run LLMs on a MacBook or generic Linux machine with high performance.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/ggerganov/llama.cpp',
    tags: ['local', 'optimization', 'cli'],
    bestFor: 'Running LLMs on consumer hardware'
  },
  {
    id: 'axolotl',
    name: 'Axolotl',
    description: 'The best tool for fine-tuning LLMs. Config-file based fine-tuning of Llama, Mistral, and more.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/OpenAccess-AI-Collective/axolotl',
    tags: ['fine-tuning', 'training', 'advanced'],
    bestFor: 'Training custom LLMs'
  },
  {
    id: 'privategpt',
    name: 'PrivateGPT',
    description: 'Interact with your documents using the power of GPT, 100% privately, no data leaks.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/imartinez/privateGPT',
    tags: ['privacy', 'documents', 'rag'],
    bestFor: 'Secure document chat'
  },
  {
    id: 'auto-gpt',
    name: 'AutoGPT',
    description: 'An experimental open-source attempt to make GPT-4 fully autonomous.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/Significant-Gravitas/Auto-GPT',
    tags: ['agent', 'autonomous', 'automation'],
    bestFor: 'Autonomous web tasks'
  },
  {
    id: 'babyagi',
    name: 'BabyAGI',
    description: 'A task-driven autonomous agent. Creates tasks, executes them, and creates new tasks based on results.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/yoheinakajima/babyagi',
    tags: ['agent', 'task-management', 'python'],
    bestFor: 'Task automation loops'
  },
  {
    id: 'invokeai',
    name: 'InvokeAI',
    description: 'A leading creative engine for Stable Diffusion models. Professional-grade interface.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://invoke-ai.com',
    tags: ['image', 'stable-diffusion', 'canvas'],
    bestFor: 'Professional local art'
  },
  {
    id: 'easydiffusion',
    name: 'Easy Diffusion',
    description: 'The easiest way to install and use Stable Diffusion on your computer. One-click install.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://easydiffusion.github.io',
    tags: ['image', 'easy', 'beginner'],
    bestFor: 'Beginners to local SD'
  },
  {
    id: 'serge',
    name: 'Serge',
    description: 'A chat interface for Llama models that runs entirely on your server/computer via Docker.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/serge-chat/serge',
    tags: ['local', 'docker', 'self-hosted'],
    bestFor: 'Self-hosted chat UI'
  },
  {
    id: 'anythingllm',
    name: 'AnythingLLM',
    description: 'All-in-one desktop application for RAG (Chat with docs) with full privacy.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://useanything.com',
    tags: ['rag', 'documents', 'desktop'],
    bestFor: 'Desktop document chat'
  },
  {
    id: 'open-webui',
    name: 'Open WebUI',
    description: 'Extensible, feature-rich, and user-friendly self-hosted WebUI designed to operate entirely offline.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://docs.openwebui.com',
    tags: ['ui', 'chat', 'ollama'],
    bestFor: 'Ollama interface'
  },

  // --- Marketing & SEO ---
  {
    id: 'surfer',
    name: 'Surfer SEO',
    description: 'AI tool for SEO strategy and content creation. Optimize content to rank higher.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://surferseo.com',
    tags: ['seo', 'marketing', 'content'],
    bestFor: 'Ranking articles'
  },
  {
    id: 'marketmuse',
    name: 'MarketMuse',
    description: 'AI content planning and optimization software. Analyze content gaps.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://www.marketmuse.com',
    tags: ['seo', 'strategy', 'enterprise'],
    bestFor: 'Content strategy'
  },
  {
    id: 'frase',
    name: 'Frase',
    description: 'Helps you research, write, and optimize high-quality SEO content in minutes.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://www.frase.io',
    tags: ['seo', 'research', 'writing'],
    bestFor: 'Content briefs'
  },
  {
    id: 'scalenut',
    name: 'Scalenut',
    description: 'All-in-one AI marketing platform. Keyword research, cruise mode writing, and optimization.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://www.scalenut.com',
    tags: ['marketing', 'seo', 'full-suite'],
    bestFor: 'Scaling content production'
  },
  {
    id: 'creativai',
    name: 'CreativAI',
    description: 'Generate social media posts, ads, and blogs. All-in-one content marketing tool.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://creativai.io',
    tags: ['marketing', 'social', 'ads'],
    bestFor: 'General marketing copy'
  },
  {
    id: 'anyword',
    name: 'Anyword',
    description: 'Performance writing platform that predicts how your copy will perform before you publish.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://anyword.com',
    tags: ['copywriting', 'analytics', 'performance'],
    bestFor: 'Data-driven copywriting'
  },
  {
    id: 'neuroflash',
    name: 'Neuroflash',
    description: 'Europe\'s No.1 AI content suite. Great for German and English content.',
    category: 'Business',
    pricing: 'Freemium',
    url: 'https://neuroflash.com',
    tags: ['copywriting', 'european', 'seo'],
    bestFor: 'European markets'
  },
  {
    id: 'simplified',
    name: 'Simplified',
    description: 'Design, write, edit videos, and publish content. An all-in-one app for modern marketing.',
    category: 'Business',
    pricing: 'Freemium',
    url: 'https://simplified.com',
    tags: ['design', 'video', 'writing'],
    bestFor: 'Small marketing teams'
  },
  {
    id: 'ocoya',
    name: 'Ocoya',
    description: 'Create, auto-generate, and schedule social media content 10x faster.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://www.ocoya.com',
    tags: ['social', 'scheduling', 'automation'],
    bestFor: 'Social media automation'
  },
  {
    id: 'reply-io',
    name: 'Reply.io',
    description: 'AI sales engagement platform. Automate outreach and personal emails.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://reply.io',
    tags: ['sales', 'email', 'outreach'],
    bestFor: 'Sales teams'
  },

  // --- Design & 3D (Expanded) ---
  {
    id: 'midjourney-web',
    name: 'Midjourney Web',
    description: 'The web interface for Midjourney (now rolling out more broadly).',
    category: 'Image',
    pricing: 'Paid',
    url: 'https://www.midjourney.com',
    tags: ['art', 'web', 'premium'],
    bestFor: 'Avoiding Discord'
  },
  {
    id: 'photoroom',
    name: 'PhotoRoom',
    description: 'Create professional product photography with AI. Remove backgrounds and add scenes.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://www.photoroom.com',
    tags: ['product', 'ecommerce', 'mobile'],
    bestFor: 'E-commerce photos'
  },
  {
    id: 'topaz-photo',
    name: 'Topaz Photo AI',
    description: 'Sharpen, remove noise, and increase resolution of your photos with tomorrow\'s technology.',
    category: 'Image',
    pricing: 'Paid',
    url: 'https://www.topazlabs.com/topaz-photo-ai',
    tags: ['enhancement', 'restoration', 'desktop'],
    bestFor: 'Restoring old photos'
  },
  {
    id: 'remove-bg',
    name: 'remove.bg',
    description: 'Remove image backgrounds automatically in 5 seconds with one click.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://www.remove.bg',
    tags: ['utility', 'background', 'fast'],
    bestFor: 'Removing backgrounds'
  },
  {
    id: 'vectorizer',
    name: 'Vectorizer.ai',
    description: 'Trace pixels to vectors in full color. Convert bitmaps to SVG, PDF, EPS.',
    category: 'Design',
    pricing: 'Paid',
    url: 'https://vectorizer.ai',
    tags: ['svg', 'vector', 'conversion'],
    bestFor: 'Logos and illustrations'
  },
  {
    id: 'recraft',
    name: 'Recraft',
    description: 'Generate vector art, icons, and 3D images. Infinite SVG generation.',
    category: 'Design',
    pricing: 'Free',
    url: 'https://www.recraft.ai',
    tags: ['vector', 'icons', 'design'],
    bestFor: 'Icon sets & vectors'
  },
  {
    id: 'logoai',
    name: 'LogoAI',
    description: 'Let AI build your brand. Logo maker and brand automation.',
    category: 'Design',
    pricing: 'Paid',
    url: 'https://www.logoai.com',
    tags: ['branding', 'logos', 'business'],
    bestFor: 'Quick logos'
  },
  {
    id: 'looka',
    name: 'Looka',
    description: 'Design your own beautiful brand. AI logo generator and brand kit.',
    category: 'Design',
    pricing: 'Paid',
    url: 'https://looka.com',
    tags: ['branding', 'logos', 'entrepreneur'],
    bestFor: 'Brand identity kits'
  },
  {
    id: 'dimensions',
    name: 'Dimensions',
    description: 'Turn 2D images into detailed 3D models with AI.',
    category: 'Design',
    pricing: 'Paid',
    url: 'https://www.dimensions.ai', // Note: Check URL validity, using generic placeholder if specific tool is newer/obscure
    tags: ['3d', 'modeling', 'conversion'],
    bestFor: 'Rapid 3D modeling'
  },
  {
    id: 'csm',
    name: 'CSM (Common Sense Machines)',
    description: 'Cube to Space. Turn any image into a game-ready 3D asset.',
    category: 'Design',
    pricing: 'Freemium',
    url: 'https://csm.ai',
    tags: ['3d', 'game-dev', 'assets'],
    bestFor: 'Game asset creation'
  },

  // --- Video & Audio (Expanded) ---
  {
    id: 'veed',
    name: 'VEED.IO',
    description: 'Online video suite for professionals. Record, edit, and stream videos.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://www.veed.io',
    tags: ['editor', 'subtitles', 'social'],
    bestFor: 'Quick social edits'
  },
  {
    id: 'wondershare-filmora',
    name: 'Wondershare Filmora',
    description: 'Easy-to-use video editor with built-in AI features like portrait cutout and smart cutout.',
    category: 'Video',
    pricing: 'Paid',
    url: 'https://filmora.wondershare.com',
    tags: ['editor', 'desktop', 'beginner-friendly'],
    bestFor: 'YouTube editing'
  },
  {
    id: 'fliki',
    name: 'Fliki',
    description: 'Turn text into videos with AI voices. Blog to video, tweet to video.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://fliki.ai',
    tags: ['text-to-video', 'content-repurposing', 'social'],
    bestFor: 'Article to video'
  },
  {
    id: 'pictory',
    name: 'Pictory',
    description: 'Automatically create short, highly-shareable branded videos from your long form content.',
    category: 'Video',
    pricing: 'Paid',
    url: 'https://pictory.ai',
    tags: ['repurposing', 'marketing', 'clips'],
    bestFor: 'Webinar summaries'
  },
  {
    id: 'lalal',
    name: 'Lalal.ai',
    description: 'Extract vocal, accompaniment and various instruments from any audio and video.',
    category: 'Audio',
    pricing: 'Paid',
    url: 'https://www.lalal.ai',
    tags: ['stem-splitting', 'music', 'karaoke'],
    bestFor: 'Musicians & Remixing'
  },
  {
    id: 'krisp',
    name: 'Krisp',
    description: 'AI noise cancellation. Removes background noise, echoes, and voices from calls.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://krisp.ai',
    tags: ['calls', 'noise-cancelling', 'meetings'],
    bestFor: 'Clear conference calls'
  },
  {
    id: 'voicemod',
    name: 'Voicemod',
    description: 'Free real-time voice changer. Transform your voice for gaming and content creation.',
    category: 'Audio',
    pricing: 'Free',
    url: 'https://www.voicemod.net',
    tags: ['voice-changer', 'gaming', 'streaming'],
    bestFor: 'Streamers & Gamers'
  },
  {
    id: 'soundraw',
    name: 'Soundraw',
    description: 'AI music generator for creators. Customize the length, composition, and instruments.',
    category: 'Audio',
    pricing: 'Paid',
    url: 'https://soundraw.io',
    tags: ['music', 'background', 'royalty-free'],
    bestFor: 'Background music'
  },
  {
    id: 'beatoven',
    name: 'Beatoven.ai',
    description: 'Create unique royalty-free music that elevates your storytelling.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://www.beatoven.ai',
    tags: ['music', 'mood', 'video'],
    bestFor: 'Mood-based music'
  },
  {
    id: 'cleanvoice',
    name: 'Cleanvoice',
    description: 'Removes filler words, stuttering, and mouth sounds from your podcast or audio recording.',
    category: 'Audio',
    pricing: 'Paid',
    url: 'https://cleanvoice.ai',
    tags: ['podcasting', 'editing', 'cleanup'],
    bestFor: 'Podcast cleanup'
  },

  // --- Coding & Development (Expanded) ---
  {
    id: 'code-interpreter-api',
    name: 'Code Interpreter API',
    description: 'Open source implementation of ChatGPT Code Interpreter. Run code in a sandbox.',
    category: 'Coding',
    pricing: 'Open Source',
    url: 'https://github.com/shroominic/codeinterpreter-api',
    tags: ['python', 'sandbox', 'analysis'],
    bestFor: 'Adding code execution to apps'
  },
  {
    id: 'mintlify',
    name: 'Mintlify',
    description: 'AI powered documentation that writes itself. Automate your codebase docs.',
    category: 'Coding',
    pricing: 'Freemium',
    url: 'https://mintlify.com',
    tags: ['documentation', 'developer', 'automation'],
    bestFor: 'Maintaining docs'
  },
  {
    id: 'warp',
    name: 'Warp',
    description: 'The terminal for the 21st century. AI command search and workflows built in.',
    category: 'Coding',
    pricing: 'Freemium',
    url: 'https://www.warp.dev',
    tags: ['terminal', 'cli', 'productivity'],
    bestFor: 'Terminal power users'
  },
  {
    id: 'phind',
    name: 'Phind',
    description: 'The search engine for developers. Answers technical questions with code examples.',
    category: 'Coding',
    pricing: 'Free',
    url: 'https://www.phind.com',
    tags: ['search', 'developer', 'answers'],
    bestFor: 'Debugging & API lookup'
  },
  {
    id: 'builder-io',
    name: 'Builder.io',
    description: 'Visual development platform. Drag and drop with AI to create code.',
    category: 'Coding',
    pricing: 'Freemium',
    url: 'https://www.builder.io',
    tags: ['low-code', 'react', 'cms'],
    bestFor: 'Visual site building'
  },
  {
    id: 'screenshot-to-code',
    name: 'Screenshot to Code',
    description: 'Simple tool to convert screenshots, mockups and Figma designs into clean code.',
    category: 'Coding',
    pricing: 'Open Source',
    url: 'https://github.com/abi/screenshot-to-code',
    tags: ['frontend', 'conversion', 'html'],
    bestFor: 'Cloning UI designs'
  },
  {
    id: 'v0',
    name: 'v0 (Vercel)',
    description: 'Generative UI system. Generate copy-and-paste friendly React code with Tailwind.',
    category: 'Coding',
    pricing: 'Freemium',
    url: 'https://v0.dev',
    tags: ['react', 'tailwind', 'ui'],
    bestFor: 'React components'
  },
  {
    id: 'sweep',
    name: 'Sweep',
    description: 'AI junior developer. Turns bug reports and feature requests into code changes.',
    category: 'Coding',
    pricing: 'Paid',
    url: 'https://sweep.dev',
    tags: ['agent', 'github', 'maintenance'],
    bestFor: 'Handling backlog tickets'
  },
  {
    id: 'what-the-diff',
    name: 'What The Diff',
    description: 'AI code review assistant. Understand pull requests in plain English.',
    category: 'Coding',
    pricing: 'Freemium',
    url: 'https://whatthediff.ai',
    tags: ['code-review', 'pr', 'github'],
    bestFor: 'Reviewing PRs'
  },
  {
    id: 'jamie',
    name: 'Jamie',
    description: 'AI executive assistant that generates meeting summaries in business quality.',
    category: 'Productivity',
    pricing: 'Paid',
    url: 'https://meetjamie.ai',
    tags: ['meetings', 'executive', 'summary'],
    bestFor: 'Executives'
  },

  // --- Education & Learning ---
  {
    id: 'khanmigo',
    name: 'Khanmigo',
    description: 'Khan Academy’s AI-powered guide. A tutor for learners and an assistant for teachers.',
    category: 'Research',
    pricing: 'Paid',
    url: 'https://www.khanacademy.org/khan-labs',
    tags: ['education', 'tutor', 'learning'],
    bestFor: 'Students & Teachers'
  },
  {
    id: 'duolingo-max',
    name: 'Duolingo Max',
    description: 'Language learning with AI. Roleplay and "Explain My Answer" features.',
    category: 'Other',
    pricing: 'Paid',
    url: 'https://www.duolingo.com',
    tags: ['language', 'learning', 'mobile'],
    bestFor: 'Learning languages'
  },
  {
    id: 'quizlet',
    name: 'Quizlet Q-Chat',
    description: 'AI study coach. Adaptive quizzes and conversational learning.',
    category: 'Other',
    pricing: 'Freemium',
    url: 'https://quizlet.com',
    tags: ['study', 'flashcards', 'students'],
    bestFor: 'Exam prep'
  },
  {
    id: 'photomath',
    name: 'Photomath',
    description: 'Scan math problems for instant steps and explanations.',
    category: 'Other',
    pricing: 'Freemium',
    url: 'https://photomath.com',
    tags: ['math', 'solver', 'homework'],
    bestFor: 'Math homework'
  },
  {
    id: 'socratic',
    name: 'Socratic (Google)',
    description: 'Learning app that helps students understand their school work at a high school and university level.',
    category: 'Other',
    pricing: 'Free',
    url: 'https://socratic.org',
    tags: ['homework', 'google', 'students'],
    bestFor: 'Visual explanations'
  },
  {
    id: 'yippity',
    name: 'Yippity',
    description: 'Turn any text or website into a quiz automatically.',
    category: 'Other',
    pricing: 'Freemium',
    url: 'https://yippity.io',
    tags: ['quiz', 'teachers', 'generation'],
    bestFor: 'Generating quizzes'
  },
  {
    id: 'curipod',
    name: 'Curipod',
    description: 'Make interactive lessons in seconds. AI helper for teachers.',
    category: 'Other',
    pricing: 'Freemium',
    url: 'https://curipod.com',
    tags: ['education', 'presentations', 'interactive'],
    bestFor: 'Classroom engagement'
  },
  {
    id: 'gradescope',
    name: 'Gradescope',
    description: 'AI-assisted grading. Helps instructors grade exams and homework faster.',
    category: 'Other',
    pricing: 'Paid',
    url: 'https://www.gradescope.com',
    tags: ['grading', 'university', 'efficiency'],
    bestFor: 'Teachers grading papers'
  },

  // --- Finance & Legal ---
  {
    id: 'casetext',
    name: 'Casetext (CoCounsel)',
    description: 'AI legal assistant. Review documents, research legal memos, and prepare for depositions.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://casetext.com',
    tags: ['legal', 'lawyer', 'research'],
    bestFor: 'Legal professionals'
  },
  {
    id: 'harvey',
    name: 'Harvey',
    description: 'Generative AI for elite law firms. Custom LLMs for legal work.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://www.harvey.ai',
    tags: ['legal', 'enterprise', 'contracts'],
    bestFor: 'Law firms'
  },
  {
    id: 'cleo',
    name: 'Cleo',
    description: 'AI financial assistant. Helps you budget, save, and build credit with a chat interface.',
    category: 'Other',
    pricing: 'Freemium',
    url: 'https://web.meetcleo.com',
    tags: ['finance', 'budgeting', 'chat'],
    bestFor: 'Personal finance'
  },
  {
    id: 'booke',
    name: 'Booke.ai',
    description: 'AI for accountants. Automates bookkeeping and categorization.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://booke.ai',
    tags: ['accounting', 'finance', 'automation'],
    bestFor: 'Bookkeeping'
  },
  {
    id: 'excelformulabot',
    name: 'Excel Formula Bot',
    description: 'Transform text instructions into Excel formulas and SQL queries.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://excelformulabot.com',
    tags: ['excel', 'spreadsheets', 'data'],
    bestFor: 'Excel beginners'
  },
  {
    id: 'rows',
    name: 'Rows',
    description: 'The spreadsheet where data lives. Built-in AI analyst to summarize and analyze data.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://rows.com',
    tags: ['spreadsheet', 'data', 'modern'],
    bestFor: 'Modern spreadsheet work'
  },

  // --- Data & Analytics ---
  {
    id: 'julius',
    name: 'Julius AI',
    description: 'Your personal data analyst. Chat with your data files (CSV, Excel) to create graphs and insights.',
    category: 'Research',
    pricing: 'Paid',
    url: 'https://julius.ai',
    tags: ['data', 'analytics', 'visualization'],
    bestFor: 'Analyzing spreadsheets'
  },
  {
    id: 'akkio',
    name: 'Akkio',
    description: 'Generative AI for analytics and predictive modeling. No code required.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://www.akkio.com',
    tags: ['predictive', 'ml', 'business-intelligence'],
    bestFor: 'Predictive analytics'
  },
  {
    id: 'monic',
    name: 'Monic.ai',
    description: 'Turn your files into quizzes, summaries, and flashcards instantly.',
    category: 'Research',
    pricing: 'Freemium',
    url: 'https://monic.ai',
    tags: ['study', 'conversion', 'learning'],
    bestFor: 'Studying from documents'
  },
  {
    id: 'browse-ai',
    name: 'Browse AI',
    description: 'The easiest way to extract and monitor data from any website.',
    category: 'Business',
    pricing: 'Freemium',
    url: 'https://www.browse.ai',
    tags: ['scraping', 'monitoring', 'data'],
    bestFor: 'Web scraping'
  },

  // --- Human Resources & Recruitment ---
  {
    id: 'paradox',
    name: 'Paradox',
    description: 'Conversational recruiting software. Automates screening, scheduling, and candidate questions.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://www.paradox.ai',
    tags: ['hr', 'recruiting', 'hiring'],
    bestFor: 'High-volume hiring'
  },
  {
    id: 'textio',
    name: 'Textio',
    description: 'AI for fair and effective writing in HR. Removes bias from job descriptions.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://textio.com',
    tags: ['hr', 'dei', 'writing'],
    bestFor: 'Inclusive hiring'
  },
  {
    id: 'teal',
    name: 'Teal',
    description: 'AI resume builder and job tracker. Helps candidates land jobs faster.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://www.tealhq.com',
    tags: ['career', 'resume', 'job-search'],
    bestFor: 'Job seekers'
  },
  {
    id: 'kickresume',
    name: 'Kickresume',
    description: 'Create beautiful resumes and cover letters with the help of AI.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://www.kickresume.com',
    tags: ['resume', 'design', 'career'],
    bestFor: 'Resume design'
  },

  // --- Miscellaneous / Fun ---
  {
    id: 'character-ai',
    name: 'Character.ai',
    description: 'Chat with open-ended conversational applications where you can create any character.',
    category: 'Other',
    pricing: 'Freemium',
    url: 'https://beta.character.ai',
    tags: ['chat', 'entertainment', 'roleplay'],
    bestFor: 'Entertainment chat'
  },
  {
    id: 'replika',
    name: 'Replika',
    description: 'The AI companion who cares. Always here to listen and talk. Always on your side.',
    category: 'Other',
    pricing: 'Freemium',
    url: 'https://replika.com',
    tags: ['companion', 'mental-health', 'chat'],
    bestFor: 'Companionship'
  },
  {
    id: 'pi',
    name: 'Pi (Inflection)',
    description: 'A personalized AI, designed to be supportive, smart, and there for you.',
    category: 'Text',
    pricing: 'Free',
    url: 'https://pi.ai',
    tags: ['chat', 'emotional-intelligence', 'support'],
    bestFor: 'Friendly conversation'
  },
  {
    id: 'hume',
    name: 'Hume AI',
    description: 'Empathic AI. APIs for measuring human emotional expression.',
    category: 'Research',
    pricing: 'Trial',
    url: 'https://hume.ai',
    tags: ['emotion', 'voice', 'api'],
    bestFor: 'Emotion analysis'
  },
  {
    id: 'sunon',
    name: 'Sunon',
    description: 'Actually, this is a typo fix for Suno, but let\'s add Udio if not present.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://udio.com',
    tags: ['music', 'generation', 'high-quality'],
    bestFor: 'Music generation'
  },
  {
    id: 'gamma-app',
    name: 'Gamma',
    description: 'A new medium for presenting ideas. Powered by AI.',
    category: 'Business',
    pricing: 'Freemium',
    url: 'https://gamma.app',
    tags: ['presentations', 'web', 'docs'],
    bestFor: 'Making decks fast'
  },
  {
    id: 'tldv',
    name: 'tl;dv',
    description: 'Meeting recorder for Google Meet and Zoom. Transcribes and summarizes calls.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://tldv.io',
    tags: ['meetings', 'notes', 'recording'],
    bestFor: 'User research calls'
  },
  {
    id: 'grain',
    name: 'Grain',
    description: 'AI meeting notes for customer-focused teams.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://grain.com',
    tags: ['sales', 'customer-success', 'video'],
    bestFor: 'Capturing customer voice'
  },
  {
    id: 'superhuman',
    name: 'Superhuman AI',
    description: 'The fastest email experience ever made. Now with AI to write and summarize emails.',
    category: 'Productivity',
    pricing: 'Paid',
    url: 'https://superhuman.com',
    tags: ['email', 'speed', 'productivity'],
    bestFor: 'Email power users'
  },
  {
    id: 'shortwave',
    name: 'Shortwave',
    description: 'The smartest email app for Gmail. AI executive assistant for your inbox.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://www.shortwave.com',
    tags: ['email', 'summary', 'gmail'],
    bestFor: 'Gmail organization'
  },
  {
    id: 'arc-browser',
    name: 'Arc Search',
    description: 'A browser that browses for you. "Browse for me" summarizes search results.',
    category: 'Productivity',
    pricing: 'Free',
    url: 'https://arc.net',
    tags: ['browser', 'search', 'mobile'],
    bestFor: 'Mobile searching'
  },
  {
    id: 'cron',
    name: 'Notion Calendar (Cron)',
    description: 'The next-generation calendar for professionals. Integrated with Notion.',
    category: 'Productivity',
    pricing: 'Free',
    url: 'https://www.notion.so/calendar',
    tags: ['calendar', 'scheduling', 'design'],
    bestFor: 'Scheduling'
  },
  {
    id: 'reclaim',
    name: 'Reclaim.ai',
    description: 'Smart calendar for Google Calendar. Auto-schedules habits and tasks.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://reclaim.ai',
    tags: ['calendar', 'time-blocking', 'google'],
    bestFor: 'Time blocking'
  },
  {
    id: 'motion',
    name: 'Motion',
    description: 'AI that builds your schedule. Project management and calendar in one.',
    category: 'Productivity',
    pricing: 'Paid',
    url: 'https://www.usemotion.com',
    tags: ['planning', 'adhd', 'automation'],
    bestFor: 'Automated scheduling'
  },
  {
    id: 'morgen',
    name: 'Morgen',
    description: 'Unified calendar, scheduler, and task manager.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://morgen.so',
    tags: ['calendar', 'desktop', 'tasks'],
    bestFor: 'Unified calendar'
  },

  // --- More Audio/Video & Niche ---
  {
    id: 'riverside',
    name: 'Riverside.fm',
    description: 'Record studio-quality audio and video remotely. AI transcription and clips.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://riverside.fm',
    tags: ['recording', 'podcast', 'studio'],
    bestFor: 'Remote recording'
  },
  {
    id: 'podcastle',
    name: 'Podcastle',
    description: 'Studio-quality recording, AI editing, and magical audio enhancement.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://podcastle.ai',
    tags: ['podcast', 'editing', 'browser'],
    bestFor: 'Browser-based podcasting'
  },
  {
    id: 'audiopen',
    name: 'AudioPen',
    description: 'The easiest way to convert messy thoughts into clear text. Just talk.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://audiopen.ai',
    tags: ['transcription', 'notes', 'voice'],
    bestFor: 'Voice notes to text'
  },
  {
    id: 'fathom',
    name: 'Fathom',
    description: 'Free AI Meeting Assistant. Records, transcribes, highlights, and summarizes.',
    category: 'Productivity',
    pricing: 'Free',
    url: 'https://fathom.video',
    tags: ['meetings', 'zoom', 'free'],
    bestFor: 'Free meeting summaries'
  },
  {
    id: 'supernormal',
    name: 'Supernormal',
    description: 'AI notes for Google Meet, Zoom, and Teams.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://supernormal.com',
    tags: ['meetings', 'notes', 'teams'],
    bestFor: 'Google Meet notes'
  },
  {
    id: 'assemblyai',
    name: 'AssemblyAI',
    description: 'API for Speech-to-Text and Audio Intelligence. Transcribe and understand audio.',
    category: 'Audio',
    pricing: 'Paid',
    url: 'https://www.assemblyai.com',
    tags: ['api', 'transcription', 'developer'],
    bestFor: 'Developers building audio apps'
  },
  {
    id: 'deepgram',
    name: 'Deepgram',
    description: 'Fastest Speech-to-Text API. Real-time transcription for enterprise.',
    category: 'Audio',
    pricing: 'Paid',
    url: 'https://deepgram.com',
    tags: ['api', 'real-time', 'enterprise'],
    bestFor: 'Real-time transcription'
  },
  {
    id: 'glasp',
    name: 'Glasp',
    description: 'Social web highlighter. Highlight and organize quotes and thoughts from the web.',
    category: 'Productivity',
    pricing: 'Free',
    url: 'https://glasp.co',
    tags: ['highlighter', 'knowledge', 'social'],
    bestFor: 'Saving web highlights'
  },
  {
    id: 'readwise',
    name: 'Readwise Reader',
    description: 'The first "read-it-later" app built for power readers. AI summaries and ghostreader.',
    category: 'Productivity',
    pricing: 'Paid',
    url: 'https://readwise.io/read',
    tags: ['reading', 'rss', 'highlights'],
    bestFor: 'Power readers'
  },
  {
    id: 'snipd',
    name: 'Snipd',
    description: 'AI Podcast Player. Highlight moments in podcasts and sync to Notion.',
    category: 'Audio',
    pricing: 'Free',
    url: 'https://snipd.com',
    tags: ['podcast', 'learning', 'mobile'],
    bestFor: 'Podcast learning'
  },

  // --- Writing & Content (More) ---
  {
    id: 'hem',
    name: 'Hemingway Editor Plus',
    description: 'Fixes wordy sentences, glitches, and more with AI.',
    category: 'Text',
    pricing: 'Paid',
    url: 'https://hemingwayapp.com',
    tags: ['editing', 'clarity', 'writing'],
    bestFor: 'Clear writing'
  },
  {
    id: 'pro-writing-aid',
    name: 'ProWritingAid',
    description: 'AI-powered grammar checker and style editor. More in-depth than Grammarly.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://prowritingaid.com',
    tags: ['grammar', 'style', 'long-form'],
    bestFor: 'Fiction & long-form editing'
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    description: 'The standard for AI writing assistance. Grammar, tone, and clarity.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://www.grammarly.com',
    tags: ['grammar', 'writing', 'ubiquitous'],
    bestFor: 'Everyday writing correction'
  },
  {
    id: 'deepl',
    name: 'DeepL',
    description: 'The world\'s most accurate translator. Nuanced and natural translations.',
    category: 'Text',
    pricing: 'Freemium',
    url: 'https://www.deepl.com',
    tags: ['translation', 'language', 'accurate'],
    bestFor: 'Translation'
  },
  {
    id: 'wordai',
    name: 'WordAi',
    description: 'Uses advanced machine learning models to provide high quality rewriting.',
    category: 'Text',
    pricing: 'Paid',
    url: 'https://wordai.com',
    tags: ['spinning', 'rewrite', 'seo'],
    bestFor: 'Content spinning'
  },
  {
    id: 'spin-rewriter',
    name: 'Spin Rewriter',
    description: 'Article spinner that understands the meaning of content.',
    category: 'Text',
    pricing: 'Paid',
    url: 'https://www.spinrewriter.com',
    tags: ['seo', 'spinning', 'marketing'],
    bestFor: 'Mass content generation'
  },
  {
    id: 'closerscopy',
    name: 'ClosersCopy',
    description: 'AI copywriting robot. Specialized in sales copy and direct response.',
    category: 'Text',
    pricing: 'Paid',
    url: 'https://closerscopy.com',
    tags: ['sales', 'copywriting', 'direct-response'],
    bestFor: 'Sales letters'
  },
  {
    id: 'longshot',
    name: 'LongShot AI',
    description: 'AI writing assistant for long-form content. Fact-checking built in.',
    category: 'Text',
    pricing: 'Paid',
    url: 'https://www.longshot.ai',
    tags: ['blogging', 'long-form', 'fact-check'],
    bestFor: 'Fact-based articles'
  },
  {
    id: 'narrato',
    name: 'Narrato',
    description: 'AI content workspace. Plan, create, and collaborate on content.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://narrato.io',
    tags: ['workflow', 'content-ops', 'teams'],
    bestFor: 'Content teams'
  },
  {
    id: 'ink',
    name: 'INK',
    description: 'All-in-one AI content platform for performance marketing.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://inkforall.com',
    tags: ['seo', 'safety', 'marketing'],
    bestFor: 'Brand safe content'
  },

  // --- Developer & Data (More) ---
  {
    id: 'monkeylearn',
    name: 'MonkeyLearn',
    description: 'No-code text analytics. Sentiment analysis, topic classification, etc.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://monkeylearn.com',
    tags: ['analytics', 'nlp', 'no-code'],
    bestFor: 'Analyzing customer feedback'
  },
  {
    id: 'polly',
    name: 'Polly (AWS)',
    description: 'Turn text into lifelike speech using deep learning.',
    category: 'Audio',
    pricing: 'Freemium',
    url: 'https://aws.amazon.com/polly/',
    tags: ['tts', 'cloud', 'aws'],
    bestFor: 'App developers'
  },
  {
    id: 'google-cloud-vision',
    name: 'Google Cloud Vision',
    description: 'Derive insights from your images in the cloud or at the edge.',
    category: 'Image',
    pricing: 'Paid',
    url: 'https://cloud.google.com/vision',
    tags: ['api', 'recognition', 'google'],
    bestFor: 'Image analysis apps'
  },
  {
    id: 'clarifai',
    name: 'Clarifai',
    description: 'The leading computer vision AI platform for developers.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://www.clarifai.com',
    tags: ['vision', 'platform', 'enterprise'],
    bestFor: 'Enterprise computer vision'
  },
  {
    id: 'roboflow',
    name: 'Roboflow',
    description: 'Everything you need to build and deploy computer vision models.',
    category: 'Coding',
    pricing: 'Freemium',
    url: 'https://roboflow.com',
    tags: ['computer-vision', 'datasets', 'training'],
    bestFor: 'Training vision models'
  },
  {
    id: 'h2o',
    name: 'H2O.ai',
    description: 'Open source leader in democratizing AI. AutoML platform.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://h2o.ai',
    tags: ['automl', 'enterprise', 'data-science'],
    bestFor: 'Data scientists'
  },
  {
    id: 'datarobot',
    name: 'DataRobot',
    description: 'AI cloud platform for building and deploying machine learning models.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://www.datarobot.com',
    tags: ['enterprise', 'ml', 'automl'],
    bestFor: 'Large enterprise ML'
  },
  {
    id: 'domino',
    name: 'Domino Data Lab',
    description: 'Enterprise MLOps platform for data science teams.',
    category: 'Business',
    pricing: 'Paid',
    url: 'https://dominodatalab.com',
    tags: ['mlops', 'data-science', 'collaboration'],
    bestFor: 'Data science teams'
  },
  {
    id: 'gradio',
    name: 'Gradio',
    description: 'Build and share delightful machine learning apps, all in Python.',
    category: 'Coding',
    pricing: 'Open Source',
    url: 'https://gradio.app',
    tags: ['ui', 'python', 'demo'],
    bestFor: 'Demoing ML models'
  },
  {
    id: 'streamlit',
    name: 'Streamlit',
    description: 'Turn data scripts into shareable web apps in minutes. All in pure Python.',
    category: 'Coding',
    pricing: 'Open Source',
    url: 'https://streamlit.io',
    tags: ['ui', 'python', 'data'],
    bestFor: 'Building data apps'
  },
  {
    id: 'langchain',
    name: 'LangChain',
    description: 'Framework for developing applications powered by language models.',
    category: 'Coding',
    pricing: 'Open Source',
    url: 'https://langchain.com',
    tags: ['framework', 'llm', 'python'],
    bestFor: 'Building LLM apps'
  },
  {
    id: 'llamaindex',
    name: 'LlamaIndex',
    description: 'Data framework for LLM applications to ingest, structure, and access private data.',
    category: 'Coding',
    pricing: 'Open Source',
    url: 'https://www.llamaindex.ai',
    tags: ['data', 'rag', 'indexing'],
    bestFor: 'Connecting data to LLMs'
  },

  // --- Final Mix ---
  {
    id: 'godmode',
    name: 'Godmode',
    description: 'Web platform to access AutoGPT and BabyAGI agents.',
    category: 'Unrestricted',
    pricing: 'Free',
    url: 'https://godmode.space',
    tags: ['agents', 'web', 'automation'],
    bestFor: 'Trying agents easily'
  },
  {
    id: 'agentgpt',
    name: 'AgentGPT',
    description: 'Assemble, configure, and deploy autonomous AI Agents in your browser.',
    category: 'Unrestricted',
    pricing: 'Freemium',
    url: 'https://agentgpt.reworkd.ai',
    tags: ['agents', 'browser', 'visual'],
    bestFor: 'Browser-based agents'
  },
  {
    id: 'cognosys',
    name: 'Cognosys',
    description: 'AI agents that can use a browser to complete tasks for you.',
    category: 'Productivity',
    pricing: 'Freemium',
    url: 'https://www.cognosys.ai',
    tags: ['agents', 'web-browsing', 'automation'],
    bestFor: 'Web-based tasks'
  },

  // --- Even More Tools (Rounding up to 250+) ---
  {
    id: 'falcon',
    name: 'Falcon LLM',
    description: 'Open source large language model. Top-performing open model for commercial use.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://huggingface.co/tiiuae',
    tags: ['llm', 'open-source', 'commercial'],
    bestFor: 'Commercial open source apps'
  },
  {
    id: 'yi-01',
    name: 'Yi (01.AI)',
    description: 'High-performance open bilingual (English/Chinese) language models.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/01-ai/Yi',
    tags: ['llm', 'bilingual', 'high-performance'],
    bestFor: 'Multilingual applications'
  },
  {
    id: 'whisper-cpp',
    name: 'Whisper.cpp',
    description: 'High-performance inference of OpenAI\'s Whisper automatic speech recognition (ASR) model.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/ggerganov/whisper.cpp',
    tags: ['audio', 'transcription', 'local'],
    bestFor: 'Fast local transcription'
  },
  {
    id: 'bark',
    name: 'Bark (Suno)',
    description: 'Transformer-based text-to-audio model. Generates highly realistic, multilingual speech as well as other audio.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/suno-ai/bark',
    tags: ['audio', 'tts', 'generative'],
    bestFor: 'Realistic open source TTS'
  },
  {
    id: 'tortoise-tts',
    name: 'Tortoise TTS',
    description: 'A multi-voice TTS system trained with an emphasis on quality.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/neonbjb/tortoise-tts',
    tags: ['audio', 'tts', 'high-quality'],
    bestFor: 'High-fidelity voice synthesis'
  },
  {
    id: 'open-assistant',
    name: 'Open Assistant',
    description: 'A project meant to give everyone access to a great chat based large language model.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://open-assistant.io',
    tags: ['chat', 'open-source', 'community'],
    bestFor: 'Community-driven chat'
  },
  {
    id: 'gpt-engineer',
    name: 'GPT Engineer',
    description: 'Specify what you want it to build, the AI asks for clarification, and then builds it.',
    category: 'Coding',
    pricing: 'Open Source',
    url: 'https://github.com/AntonOsika/gpt-engineer',
    tags: ['coding', 'agent', 'builder'],
    bestFor: 'Scaffolding entire projects'
  },
  {
    id: 'meta-seamless',
    name: 'SeamlessM4T',
    description: 'Foundational multilingual and multimodal AI model for speech and text translations.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://ai.meta.com/resources/models-and-libraries/seamless-communication-models/',
    tags: ['translation', 'speech', 'multimodal'],
    bestFor: 'Universal translation'
  },
  {
    id: 'musicgen',
    name: 'MusicGen (Meta)',
    description: 'Simple and controllable music generation. Text-to-music.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/facebookresearch/audiocraft',
    tags: ['music', 'generation', 'meta'],
    bestFor: 'Generating music locally'
  },
  {
    id: 'audiocraft',
    name: 'AudioCraft',
    description: 'Library for audio processing and generation with deep learning (includes MusicGen).',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/facebookresearch/audiocraft',
    tags: ['audio', 'research', 'generation'],
    bestFor: 'Audio researchers'
  },
  {
    id: 'animated-drawings',
    name: 'Animated Drawings',
    description: 'Bring children\'s drawings to life by animating characters to move around.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://sketch.metademolab.com',
    tags: ['animation', 'fun', 'research'],
    bestFor: 'Animating sketches'
  },
  {
    id: 'segment-anything',
    name: 'Segment Anything',
    description: 'Cut out any object, in any image, with a single click. Meta\'s SAM model.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://segment-anything.com',
    tags: ['vision', 'segmentation', 'meta'],
    bestFor: 'Precise image masking'
  },
  {
    id: 'draggan',
    name: 'DragGAN',
    description: 'Interactive point-based manipulation on the generative image manifold.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/XingangPan/DragGAN',
    tags: ['image', 'editing', 'research'],
    bestFor: 'Morphing images'
  },
  {
    id: 'controlnet',
    name: 'ControlNet',
    description: 'Adding conditional control to text-to-image diffusion models (structure, pose, etc.).',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/lllyasviel/ControlNet',
    tags: ['image', 'stable-diffusion', 'control'],
    bestFor: 'Precise composition control'
  },
  {
    id: 'ip-adapter',
    name: 'IP-Adapter',
    description: 'Text Compatible Image Prompt Adapter for Text-to-Image Diffusion Models.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'https://github.com/tencent-ailab/IP-Adapter',
    tags: ['image', 'style-transfer', 'stable-diffusion'],
    bestFor: 'Image-to-image styling'
  },
  {
    id: 'd-id',
    name: 'D-ID',
    description: 'Create realistic digital humans from text or audio. Live portrait technology.',
    category: 'Video',
    pricing: 'Paid',
    url: 'https://www.d-id.com',
    tags: ['avatars', 'animation', 'faces'],
    bestFor: 'Talking photos'
  },
  {
    id: 'hour-one',
    name: 'Hour One',
    description: 'AI video generator. Turn text into video with virtual presenters.',
    category: 'Video',
    pricing: 'Paid',
    url: 'https://hourone.ai',
    tags: ['avatars', 'marketing', 'presenters'],
    bestFor: 'Virtual presenters'
  },
  {
    id: 'colossyan',
    name: 'Colossyan',
    description: 'AI video creator for workplace learning. Create videos from text.',
    category: 'Video',
    pricing: 'Paid',
    url: 'https://www.colossyan.com',
    tags: ['training', 'avatars', 'corporate'],
    bestFor: 'Corporate training'
  },
  {
    id: 'elai',
    name: 'Elai.io',
    description: 'Build customized AI videos with a presenter in minutes without a camera.',
    category: 'Video',
    pricing: 'Paid',
    url: 'https://elai.io',
    tags: ['video', 'avatars', 'content'],
    bestFor: 'Explainer videos'
  },
  {
    id: 'steve-ai',
    name: 'Steve.ai',
    description: 'AI video maker for social media and content marketing. Text to video/animation.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://www.steve.ai',
    tags: ['animation', 'social', 'easy'],
    bestFor: 'Animated social posts'
  },
  {
    id: 'raw-shorts',
    name: 'Raw Shorts',
    description: 'AI video maker that uses spreadsheets to generate videos.',
    category: 'Video',
    pricing: 'Paid',
    url: 'https://www.rawshorts.com',
    tags: ['animation', 'business', 'data'],
    bestFor: 'Data-driven video'
  },
  {
    id: 'lumen5',
    name: 'Lumen5',
    description: 'Video maker that turns blog posts into engaging videos for social marketing.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://lumen5.com',
    tags: ['marketing', 'blog-to-video', 'social'],
    bestFor: 'Blog promotion'
  },
  {
    id: 'animaker',
    name: 'Animaker',
    description: 'A platform for beginners, non-designers & professionals to create animation and live-action videos.',
    category: 'Video',
    pricing: 'Freemium',
    url: 'https://www.animaker.com',
    tags: ['animation', 'diy', 'creative'],
    bestFor: 'DIY Animation'
  },
  {
    id: 'deep-nostalgia',
    name: 'Deep Nostalgia',
    description: 'Animate the faces in your family photos. Offered by MyHeritage.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://www.myheritage.com/deep-nostalgia',
    tags: ['animation', 'photos', 'family'],
    bestFor: 'Animating old photos'
  },
  {
    id: 'palette-fm',
    name: 'Palette.fm',
    description: 'Colorize black and white photos with AI. No signup required.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://palette.fm',
    tags: ['colorization', 'photos', 'easy'],
    bestFor: 'Colorizing photos'
  },
  {
    id: 'watermark-remover',
    name: 'WatermarkRemover.io',
    description: 'Remove watermarks from images for free using AI.',
    category: 'Image',
    pricing: 'Free',
    url: 'https://www.watermarkremover.io',
    tags: ['utility', 'cleanup', 'free'],
    bestFor: 'Removing watermarks'
  },
  {
    id: 'erase-bg',
    name: 'Erase.bg',
    description: 'Free background remover for images. Supports high-res.',
    category: 'Image',
    pricing: 'Free',
    url: 'https://www.erase.bg',
    tags: ['background', 'utility', 'free'],
    bestFor: 'Free background removal'
  },
  {
    id: 'bigjpg',
    name: 'BigJPG',
    description: 'AI Super-Resolution image enlarger. specialized in anime-style artwork.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://bigjpg.com',
    tags: ['upscaler', 'anime', 'utility'],
    bestFor: 'Upscaling anime'
  },
  {
    id: 'waifu2x',
    name: 'Waifu2x',
    description: 'Image super-resolution for anime-style art. Open source and free.',
    category: 'Unrestricted',
    pricing: 'Open Source',
    url: 'http://waifu2x.udp.jp',
    tags: ['upscaler', 'anime', 'classic'],
    bestFor: 'Classic anime upscaling'
  },
  {
    id: 'brandmark',
    name: 'Brandmark',
    description: 'Create a unique, professional logo for your business. AI design tools.',
    category: 'Design',
    pricing: 'Paid',
    url: 'https://brandmark.io',
    tags: ['logos', 'branding', 'design'],
    bestFor: 'Instant logos'
  },
  {
    id: 'designs-ai',
    name: 'Designs.ai',
    description: 'Creative AI platform. Make logos, videos, banners, and mockups in 2 minutes.',
    category: 'Design',
    pricing: 'Paid',
    url: 'https://designs.ai',
    tags: ['platform', 'marketing', 'design'],
    bestFor: 'Marketing assets'
  },
  {
    id: 'khroma',
    name: 'Khroma',
    description: 'The AI color tool for designers. Discover, search, and save color combinations.',
    category: 'Design',
    pricing: 'Free',
    url: 'https://www.khroma.co',
    tags: ['color', 'inspiration', 'design'],
    bestFor: 'Color palettes'
  },
  {
    id: 'fontjoy',
    name: 'Fontjoy',
    description: 'Generate font pairings with deep learning.',
    category: 'Design',
    pricing: 'Free',
    url: 'https://fontjoy.com',
    tags: ['typography', 'fonts', 'design'],
    bestFor: 'Font pairing'
  },
  {
    id: 'autodraw',
    name: 'AutoDraw',
    description: 'Fast drawing for everyone. Pair machine learning with drawings from talented artists.',
    category: 'Design',
    pricing: 'Free',
    url: 'https://www.autodraw.com',
    tags: ['drawing', 'google', 'fun'],
    bestFor: 'Turning scribbles into icons'
  },
  {
    id: 'magic-eraser',
    name: 'Magic Eraser',
    description: 'Remove unwanted things from images in seconds.',
    category: 'Image',
    pricing: 'Free',
    url: 'https://magicstudio.com/magiceraser',
    tags: ['cleanup', 'utility', 'easy'],
    bestFor: 'Quick object removal'
  },
  {
    id: 'cleanup-pictures',
    name: 'Cleanup.pictures',
    description: 'Remove objects, people, text, and defects from any picture.',
    category: 'Image',
    pricing: 'Freemium',
    url: 'https://cleanup.pictures',
    tags: ['cleanup', 'editing', 'utility'],
    bestFor: 'Photo cleanup'
  },
  {
    id: 'super-resolution',
    name: 'Deep Image',
    description: 'AI photo enhancer. Upscale images without losing quality.',
    category: 'Image',
    pricing: 'Paid',
    url: 'https://deep-image.ai',
    tags: ['upscaling', 'enhancement', 'print'],
    bestFor: 'Print quality upscaling'
  }
]
