using System.Text;
using ToDo.Infrastructure.Db_Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ToDo.WebApi;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Configuration setup
builder.Configuration.SetBasePath(Directory.GetCurrentDirectory());
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Configuration.AddEnvironmentVariables();

// Swagger setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ToDo API",
        Version = "v1"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                    }
                },
            new string[] {}
            }
        });
});
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = builder.Configuration["Jwt:aud"],
        ValidIssuer = builder.Configuration["Jwt:iss"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:key"]!)),
        ClockSkew = TimeSpan.Zero  // Optional: to immediately invalidate expired tokens
    };
});

builder.Services.AddAuthorization();
// Add controllers
builder.Services.AddControllers();

builder.Services.AddDbContext<ToDoAppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ToDoAppDatabase")));
// Configure services for Infrastructure layer
ToDo.Infrastructure.ServiceExtensions.ConfigureServices(builder.Services);
ToDo.Application.ServiceExtensions.ConfigureServices(builder.Services);
ServiceExtensions.ConfigureServices(builder.Services);

// Add CORS services and configure policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

WebApplication app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ToDo API");
    });
}

// Use CORS with the defined policy
app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();
app.UseAuthentication();  // Ensure authentication is used before authorization
app.UseAuthorization();
app.UseMiddleware<GlobalExceptionHandling>();
app.MapControllers();

app.Run();
