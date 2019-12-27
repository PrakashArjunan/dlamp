namespace dlamp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class TBL_EVENTS
    {
        public int ID { get; set; }

        public string EV_Title { get; set; }

        public string EV_Desc { get; set; }

        public DateTime EV_StartDate { get; set; }

        public DateTime EV_EndDate { get; set; }

        public string EV_Location { get; set; }

        public string EV_PostedBy { get; set; }
    }
}
