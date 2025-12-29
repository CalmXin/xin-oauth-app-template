<template>
    <div class="not-found">
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <router-link to="/">Go back home</router-link>
    </div>
</template>

<style scoped>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    font-family: Arial, sans-serif;
}

.not-found h1 {
    font-size: 6rem;
    color: #ff6b6b;
    margin: 0;
}

.not-found p {
    font-size: 1.2rem;
    color: #555;
    margin: 1rem 0;
}

.not-found a {
    color: #1e90ff;
    text-decoration: none;
    font-weight: bold;
}

.not-found a:hover {
    text-decoration: underline;
}
</style>