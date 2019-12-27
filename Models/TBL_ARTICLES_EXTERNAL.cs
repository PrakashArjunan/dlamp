namespace dlamp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class TBL_ARTICLES_EXTERNAL
    {
        public int ID { get; set; }

        public string AR_URL { get; set; }

        public string AR_SharedBy { get; set; }

        public string AR_Category { get; set; }

        public string AR_Website { get; set; }

    }
}
