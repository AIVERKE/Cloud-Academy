<template>
  <v-container class="fill-height bg-background" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Ingreso - Cloud Academy</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="submit">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Correo Institucional"
                name="email"
                prepend-icon="mdi-email"
                type="text"
                placeholder="usuario@umsa.bo"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Contraseña"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                required
              ></v-text-field>

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mt-3"
              >
                {{ error }}
              </v-alert>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :loading="loading" @click="submit">
              Ingresar
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mt-4" variant="tonal" color="info">
          <v-card-text class="text-caption">
            <strong>Tips para probar:</strong><br/>
            Usa <code>docente@umsa.bo</code> para entrar como Docente.<br/>
            Usa <code>admin@umsa.bo</code> para entrar como Admin.<br/>
            Cualquier otro correo <code>@umsa.bo</code> entrará como Estudiante.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const valid = ref(false);
const form = ref<any>(null);
const email = ref('');
const password = ref('password123'); // prefilled dummy password
const loading = ref(false);
const error = ref('');

const emailRules = [
  (v: string) => !!v || 'El correo es requerido',
  (v: string) => /.+@umsa\.bo$/.test(v) || 'Se requiere correo institucional (@umsa.bo)'
];

const passwordRules = [
  (v: string) => !!v || 'La contraseña es requerida'
];

const submit = async () => {
  const { valid } = await form.value.validate();

  if (valid) {
    loading.value = true;
    error.value = '';

    try {
      await authStore.login(email.value);
      router.push('/');
    } catch (err) {
      error.value = 'Error al iniciar sesión.';
    } finally {
      loading.value = false;
    }
  }
};
</script>
