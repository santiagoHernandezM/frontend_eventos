<template>
    <v-card-text class="carta">
        <v-form ref="form">
        <v-container>

            <v-row v-for="(fila, iFila) in camposForm" :key="iFila">
                <v-col v-for="(campo, iColumna) in fila" :key="iColumna">
                    <v-text-field
                        v-if="campo.type === 'v-text-field'"
                        v-model="datos[campo.vModel]"
                        :label="campo.label"
                        :append-icon="campo.icon"
                        outlined
                        @change="enviarDatos()"
                    >
                    </v-text-field>

                    <v-select
                        v-if="campo.type === 'v-select'"
                        v-model="datos[campo.vModel]"
                        :label="campo.label"
                        :items="campo.items"
                        :item-text="campo.itemText"
                        :item-value="campo.itemValue"
                        :append-icon="campo.icon"
                        outlined
                        @change="enviarDatos()"
                    >
                    </v-select>
                </v-col>
            </v-row>
            
        </v-container>
        </v-form>
        <pre>{{ $data }}</pre>
    </v-card-text>
</template>

<script>

export default {
    props: ['camposForm'],
    data(){
        return {
            datos: {},
            camposRules: [(v) => !!v || "Campo es requerido"],
            // camposForm: [
            //     [
            //         {
            //         type: 'v-text-field',
            //         vModel: this.paquete.codigo,
            //         label: 'Código de la regional',
            //         // prependInnerIcone: 'mdi mdi-key-variant'
            //         },
            //         {

            //         type: 'v-text-field',
            //         // vModel: this.paquete.nombre,
            //         label: 'Nombre de la regional',
            //         // appendIcon: "mdi mdi-pencil"
            //         }
            //     ],
            //     [
            //         {
            //         type: 'v-select',
            //         // vModel: this.paquete.departamento,
            //         // items: this.departamentos,
            //         // itemText: 'departamento',
            //         // itemValue: 'departamento',
            //         label: 'Seleccione el departamento',
            //         // appendIcon: "mdi mdi-map-search"
            //         },
            //         {
            //         type: 'v-select',
            //         // vModel: this.paquete.municipio,
            //         // items: this.ciudades,
            //         // itemText: 'departamento',
            //         // itemValue: 'departamento',
            //         label: 'Seleccione una ciudad',
            //         // appendIcon: "mdi mdi-map-marker-radius"
            //         },
                    
            //     ]
            // ]

        }
    },

    methods: {
        enviarDatos(){
            this.$emit('datos', this.datos)
        }
    }
}
</script>