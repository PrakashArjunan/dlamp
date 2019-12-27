namespace dlamp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class TBL_COURSES
    { 
        public int ID { get; set; }

        public string CR_URL { get; set; }

        public string CR_SharedBy { get; set; }

        public string CR_Category { get; set; }

        public string CR_Website { get; set; }

        public string CR_Type { get; set; }

    }
}