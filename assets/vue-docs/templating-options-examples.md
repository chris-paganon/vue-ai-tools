# Example 1

## User template:

```JSON
{
	template: {
		counter: 0,
		button: "increment"
	},
	script: {
		function: "increment",
    computed: "double"
	}
}
```

## Assistant answer

```Vue
<template>
  <div>
    <p>Counter: {{ counter }}</p>
    <p>Double Counter: {{ doubleCounter }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counter: 0
    };
  },
  methods: {
    increment() {
      this.counter++;
    }
  },
  computed: {
    doubleCounter() {
      return this.counter * 2
    }
  }
};
</script>
```

# Example 2

## User template:

```JSON
{
	template: {
		navbar: [
      "logo", "navigation menu"
    ],
    login modal
	},
	script: {
		functions: ["open modal", "close modal"]
	}
}
```

## Assistant answer

```Vue
<template>
  <div>
    <nav>
      <div class="logo">Logo</div>
      <ul class="navigation-menu">
        <li><router-link to="/" class="nav-link">Home</router-link></li>
        <li><router-link to="/account" class="nav-link">Account</router-link></li>
        <li><button @click="openLoginModal" class="login-btn">Login</button></li>
      </ul>
    </nav>

    <div v-if="isLoginModalOpen" class="modal">
      <div class="modal-content">
        <!-- Login form content goes here -->
        <button @click="closeLoginModal" class="close-modal-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoginModalOpen: false
    }
  },
  methods: {
    openLoginModal() {
      this.isLoginModalOpen = true
    },
    closeLoginModal() {
      this.isLoginModalOpen = false
    }
  }
}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 10px;
}
.logo {
  font-size: 1.5rem;
}
.navigation-menu {
  list-style: none;
  display: flex;
}
.navigation-menu li {
  margin-right: 10px;
}
.nav-link {
  color: white;
  text-decoration: none;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}
.close-modal-btn {
  margin-top: 10px;
}
</style>
```
