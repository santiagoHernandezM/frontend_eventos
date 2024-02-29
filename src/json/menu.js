let menu = [
    {
      admin : [
        {
          header: true,
          title: "MENU EVENTOS",
          hiddenOnCollapse: false,
         
        },
        {
          href: "/dashboard/regional",
          title: "Regional",
          icon: "fa fa-building", 
        },
        {
          href: "/dashboard/centro",
          title: "Centro",
          icon: "mdi mdi-bank",
        },
        {
          href: "/dashboard/sede",
          title: "Sede",
          icon: "mdi mdi-home-variant",
        },
        {
          title: "Infra-estructura",
          icon: "fa fa-cogs",
    
          child: [
            {
              href: "/dashboard/bloque",
              title: "Bloque"
            },
            {
              href: "/dashboard/tipoAmbiente",
              title: "Tipo Ambiente"
            },
            {
              href: "/dashboard/ambiente",
              title: "Ambiente"
            },
          ],
        },
        {
          title: "Programa",
          icon: "fa fa-life-ring",
    
          child: [
            {
              href: "/dashboard/crearprograma",
              title: "Crear",
            },
            {
              title: " * Ficha",
    
              child: [
                {
                  href: "/dashboard/crearficha",
                  title: "Crear Ficha",
                },
                {
                  href: "/dashboard/listarfichas",
                  title: "Listar",
                },
              ],
            },
          ],
        },
        {
          title: "Competencia",
          icon: "mdi mdi-home-variant",
    
          child: [
            {
              href: "/dashboard/crearcompetencia",
              title: "Crear",
            },
            {
              href: "/dashboard/listarcompetencia",
              title: "Listar",
            },
            {
              href: "/dashboard/crearresultadoaprendizaje",
              title: "Resultados de Aprendizaje",
            },
            {
              href: "/dashboard/carguemasivocompetencias",
              title: "Cargue Masivo",
            }
          ],
        },
        
        {
          title: "Usuario",
          icon: "fa fa-user-secret ",
    
          child: [
            {
              href: "/dashboard/crearusuario",
              title: "Crear",
            },
            {
              href: "/dashboard/listarusuario",
              title: "Listar",
            },
            ],
        },
      ]
    },
  {
    instructor : [
      {
        header: true,
        title: "MENU EVENTOS",
        hiddenOnCollapse: false,
      },
        {
            href: "/dashboard/crearevento",
            title: "Evento",
            icon: "mdi mdi-calendar-clock",
        },
        {
          href: "/dashboard/disponibilidad",
          title: "Disponibilidad",
          icon: "mdi mdi-calendar-clock",
        },
        {
          href: "/dashboard/estadistica",
          title: "Estadisticas",
          icon: "mdi mdi-chart-histogram",
        },
        {
          href: "/dashboard/salida",
          title: "Salir",
          icon: "mdi mdi-chart-histogram",
        },

    ]
  },
  
   
]

module.exports = menu;

