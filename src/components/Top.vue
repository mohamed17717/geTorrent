<template>
  <header id="search">
    <div class="logo-container">
      <h1 id="logo">ge<span>T</span>orrent</h1>
      <nav>
        <ul>
          <li><a href="#search">بحث</a></li>
          <li><a href="#content">تحميل</a></li>
          <li><a href="#images">صور</a></li>
          <li><a href="#notes">مساعدة</a></li>
        </ul>
      </nav>
    </div>
    <ProgressBar />
    <NotFoundMessage />
    <Search />
  </header>
</template>

<script>
import Search from "@/components/Search.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import NotFoundMessage from "@/components/NotFoundMessage.vue";

export default {
  name: "top",
  components: {
    Search,
    ProgressBar,
    NotFoundMessage
  }
};
</script>
