<script setup>

</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 font-mono">

    <nav class="fixed left-0 top-0 h-full w-16 md:w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-8 z-20">
      <div class="w-10 h-10 bg-blue-600 rounded flex items-center justify-center mb-12 font-bold text-white">CH</div>
      <div class="flex-1 space-y-8 text-slate-400">
        <div class="hover:text-white cursor-pointer text-center">
          <span class="block text-xs">POST</span>
        </div>
      </div>
    </nav>

    <div class="ml-16 md:ml-20">
<!--      <header-->
<!--          class="h-14 border-b border-slate-800 flex items-center px-8 bg-slate-950/50 backdrop-blur-md sticky top-0">-->
<!--        <div class="text-xs text-slate-500 uppercase tracking-widest">-->
<!--          ~/devcho/<span class="text-blue-400">current_path</span>-->
<!--        </div>-->
<!--      </header>-->

      <main class="max-w-8xl min-w-4xl mx-auto p-16">
        <section class="mb-12">
          <h2 class="text-3xl font-bold text-white mb-2">개발일지</h2>
          <p class="text-slate-400">백엔드 로직과 효율적인 구조에 대한 고민을 기록합니다.</p>
        </section>

        <div class="border-t border-slate-800 pt-12">
          <RouterView/>
        </div>
      </main>
    </div>

  </div>
</template>

<style scoped>

</style>