using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;

namespace iScheduleLHS.Helpers
{
    public class CBJSONOptions
    {
        public static JsonSerializerOptions serializeOptions = null;

        public CBJSONOptions()
        {
            if (serializeOptions == null)
            {
                serializeOptions = new JsonSerializerOptions
                {
                    IgnoreNullValues = true,
                    WriteIndented = true
                };
            }
        }
    }
}
