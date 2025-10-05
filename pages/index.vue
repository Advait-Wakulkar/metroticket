<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-arial">
    <!-- Main content -->
    <div class="flex-1 px-8 py-16">
      <!-- Title and subtitle -->
      <div class="mb-20">
        <h1 class="text-5xl font-bold text-gray-700 mb-2 tracking-tight">Metro Transit</h1>
        <p class="text-gray-600 text-lg font-normal tracking-wide">Show operator your ticket</p>
      </div>

      <!-- Logo circle with screenshot -->
      <div class="flex justify-center mb-20">
        <div class="relative">
            <div ref="ticketEl" class="w-60 h-60 rounded-full bg-white flex items-center justify-center overflow-hidden ticket-anim">
              <img 
                src="/logo.png" 
                alt="Metro Transit Logo" 
                class="w-full h-full object-contain"
              />
            </div>
        </div>
      </div>
      <!-- Real-time clock -->
      <div class="text-center mb-10">
        <div class="text-6xl font-bold text-gray-700 tracking-wider leading-tight">
          {{ currentTime }}
        </div>
      </div>

      <!-- Ticket info card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mx-4">
        <div class="">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Adult Rush Hour</h2>
          <p class="text-gray-600 text-base mb-5">Minneapolis/ St. Paul Metro Area</p>
          <div class="border-t border-gray-200 pt-4">
            <p class="text-gray-700 text-base">
              <span class="font-bold">Expires</span> <span class="font-bold">{{ expirationTime }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom indicator -->
    <div class="pb-6 flex justify-center">
      <div class="w-36 h-1 bg-gray-300 rounded-full"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive time references
const currentTime = ref('')
const expirationTime = ref('')
let timeInterval = null
const ticketEl = ref(null)

// Function to update time
const updateTime = () => {
  const now = new Date()
  let hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  
  // Convert to 12-hour format
  hours = hours % 12
  hours = hours ? hours : 12 // 0 should be 12
  
  currentTime.value = `${hours}:${minutes}:${seconds} ${ampm}`
}

// Function to calculate expiration time (1 hour from now)
const updateExpirationTime = () => {
  const now = new Date()
  const expiration = new Date(now.getTime() + 60 * 60 * 1000) // Add 1 hour
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[expiration.getMonth()]
  const day = expiration.getDate()
  const year = expiration.getFullYear()
  
  let hours = expiration.getHours()
  const minutes = expiration.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  
  // Convert to 12-hour format
  hours = hours % 12
  hours = hours ? hours : 12 // 0 should be 12
  
  expirationTime.value = `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`
}

// Setup real-time clock
onMounted(() => {
  updateTime() // Initial update
  updateExpirationTime() // Initial expiration time
  timeInterval = setInterval(updateTime, 1000) // Update every second

  // Continuous, smooth breathing animation (no hard stops)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReduced && ticketEl.value) {
    const periodMs = 2800 // cycle duration (slightly faster)
    const amplitude = 0.10 // max +10% scale for a longer breath
    let rafId
    const start = performance.now()

    const tick = (now) => {
      const t = ((now - start) % periodMs) / periodMs // 0..1
      // Smooth sinusoidal 0→1→0 via cos: y = (1 - cos(2πt)) / 2
      const y = (1 - Math.cos(2 * Math.PI * t)) / 2
      const scale = 1 + amplitude * y
      // Subtle micro-rotation to avoid mechanical feel
      const rot = 0.3 * Math.sin(2 * Math.PI * t) // degrees
      // Glow strength tied to scale (soft at peaks)
      const glow = 0.12 * y
      ticketEl.value.style.transform = `translateZ(0) scale(${scale}) rotate(${rot}deg)`
      ticketEl.value.style.boxShadow = `0 10px 24px 0 rgba(0, 82, 161, ${glow.toFixed(3)})`
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    // Store cancel on element for cleanup
    ticketEl.value.__rafId = rafId
  }
})

// Cleanup interval on unmount
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  if (ticketEl.value && ticketEl.value.__rafId) {
    cancelAnimationFrame(ticketEl.value.__rafId)
    ticketEl.value.__rafId = undefined
  }
})

// Set page title
useHead({
  title: 'Metro Transit - Show Ticket'
})
</script>

<style scoped>
/* Additional responsive styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

* {
  font-family: system-ui, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Metro-activation-like pulse visuals; motion handled via JS for smooth loop */
.ticket-anim {
  position: relative;
  will-change: transform, box-shadow;
  transform-origin: center center;
  box-shadow: 0 0 0 0 rgba(0, 82, 161, 0);
}

.ticket-anim::before {
  /* Soft highlight that gently drifts to imply movement */
  content: '';
  position: absolute;
  inset: -6%;
  border-radius: inherit;
  background: radial-gradient(120% 100% at 50% 30%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 60%);
  pointer-events: none;
  animation: drift 5200ms ease-in-out infinite alternate;
}

.ticket-anim::after {
  /* Faint rotating color ring reminiscent of validator motion */
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: conic-gradient(from 0deg, rgba(0,82,161,0.12), rgba(200,16,46,0.12), rgba(0,82,161,0.12));
  mix-blend-mode: multiply;
  opacity: 0.18;
  animation: spin 12s linear infinite;
  pointer-events: none;
}

/* keyframes removed; transform driven in JS for continuous motion */

@keyframes drift {
  from { transform: translateY(-2%); }
  to { transform: translateY(2%); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .ticket-anim { animation: none; box-shadow: none; }
  .ticket-anim::before, .ticket-anim::after { animation: none; opacity: 0.08; }
}

@media (max-width: 640px) {
  .text-6xl {
    font-size: 3.5rem;
    line-height: 1;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .text-6xl {
    font-size: 3rem;
    line-height: 1;
  }
  
  .text-5xl {
    font-size: 2rem;
  }
  
  .w-52 {
    width: 11rem;
  }
  
  .h-52 {
    height: 11rem;
  }
  
  .w-32 {
    width: 7rem;
  }
  
  .h-32 {
    height: 7rem;
  }
  
  .px-8 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style>
