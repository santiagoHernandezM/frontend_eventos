<template>
  <div class="d-flex">
    <div class="header-btn-lg pr-0">
      <div class="widget-content p-0">
        <div class="widget-content-wrapper">
          <div class="widget-content-left">
            <b-dropdown
              toggle-class="p-0 mr-2"
              menu-class="dropdown-menu-lg"
              variant="link"
              right
            >
              <span slot="button-content">
                <div class="icon-wrapper icon-wrapper-alt rounded-circle">
                  <img
                    width="42"
                    class="rounded-circle"
                    src="@/assets/images/avatars/1.jpg"
                    alt=""
                  />
                </div>
              </span>
              <button type="button" tabindex="0" class="dropdown-item">
                Settings
              </button>
              <div tabindex="-1" class="dropdown-divider"></div>
              <button
                type="button"
                tabindex="0"
                @click="salir"
                class="dropdown-item"
              >
                Logout
              </button>
            </b-dropdown>
          </div>
          <div class="widget-content-left ml-3 header-user-info">
            <div class="widget-heading">Aly Culchac</div>
            <div class="widget-subheading">VP Teacher Manager</div>
          </div>
          <div class="widget-content-right header-user-info ml-3">
            <b-btn
              v-b-tooltip.hover
              title="Tooltip Example"
              class="btn-shadow p-1"
              size="sm"
              variant="info"
            >
              <font-awesome-icon icon="calendar-alt" class="mr-1 ml-1" />
            </b-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faCalendarAlt,
  faTrashAlt,
  faCheck,
  faFileAlt,
  faCloudDownloadAlt,
  faFileExcel,
  faFilePdf,
  faFileArchive,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faAngleDown,
  faCalendarAlt,
  faTrashAlt,
  faCheck,
  faFileAlt,
  faCloudDownloadAlt,
  faFileExcel,
  faFilePdf,
  faFileArchive,
  faEllipsisH
);

export default {
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  data: () => ({}),

  methods: {
    salir() {
      this.$emit("salir");
    },
  },
};
</script>
