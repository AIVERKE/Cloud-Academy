<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-4">Mis Aulas</h1>
        <v-divider class="mb-6"></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="n in 3" :key="n" cols="12" sm="6" md="4">
        <v-card border flat>
          <v-card-item>
            <v-card-title>Aula de Prueba {{ n }}</v-card-title>
            <v-card-subtitle>Código: ABC-{{ n }}23</v-card-subtitle>
          </v-card-item>
          <v-card-text>
            Descripción corta del aula y lo que se está aprendiendo.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="text">Ver Detalle</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Classroom logic
</script>
