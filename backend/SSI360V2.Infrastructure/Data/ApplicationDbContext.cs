using Microsoft.EntityFrameworkCore;
using SSI360V2.Core.Entities;

namespace SSI360V2.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships
        modelBuilder.Entity<User>()
            .HasOne(u => u.Tenant)
            .WithMany(t => t.Users)
            .HasForeignKey(u => u.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Role>()
            .HasOne(r => r.Tenant)
            .WithMany(t => t.Roles)
            .HasForeignKey(r => r.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RolePermission>()
            .HasOne(rp => rp.Permission)
            .WithMany(p => p.RolePermissions)
            .HasForeignKey(rp => rp.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure indexes
        modelBuilder.Entity<User>()
            .HasIndex(u => new { u.Email, u.TenantId })
            .IsUnique();

        modelBuilder.Entity<Role>()
            .HasIndex(r => new { r.Name, r.TenantId })
            .IsUnique();

        modelBuilder.Entity<Tenant>()
            .HasIndex(t => t.Domain)
            .IsUnique();

        modelBuilder.Entity<Permission>()
            .HasIndex(p => new { p.Resource, p.Action })
            .IsUnique();

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed permissions
        var permissions = new List<Permission>
        {
            new() { Id = Guid.NewGuid(), Name = "View Users", Description = "Can view users", Resource = "Users", Action = "Read", IsActive = true, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Name = "Create Users", Description = "Can create users", Resource = "Users", Action = "Create", IsActive = true, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Name = "Update Users", Description = "Can update users", Resource = "Users", Action = "Update", IsActive = true, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Name = "Delete Users", Description = "Can delete users", Resource = "Users", Action = "Delete", IsActive = true, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Name = "View Roles", Description = "Can view roles", Resource = "Roles", Action = "Read", IsActive = true, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Name = "Create Roles", Description = "Can create roles", Resource = "Roles", Action = "Create", IsActive = true, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Name = "Update Roles", Description = "Can update roles", Resource = "Roles", Action = "Update", IsActive = true, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
            new() { Id = Guid.NewGuid(), Name = "Delete Roles", Description = "Can delete roles", Resource = "Roles", Action = "Delete", IsActive = true, CreatedAt = DateTime.UtcNow, CreatedBy = "System" },
        };

        modelBuilder.Entity<Permission>().HasData(permissions);

        // Seed default tenant
        var defaultTenantId = Guid.NewGuid();
        var defaultTenant = new Tenant
        {
            Id = defaultTenantId,
            Name = "Default Tenant",
            Domain = "default",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        modelBuilder.Entity<Tenant>().HasData(defaultTenant);

        // Seed admin role
        var adminRoleId = Guid.NewGuid();
        var adminRole = new Role
        {
            Id = adminRoleId,
            Name = "Admin",
            Description = "Administrator role with full access",
            IsActive = true,
            TenantId = defaultTenantId,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        modelBuilder.Entity<Role>().HasData(adminRole);

        // Seed admin user
        var adminUserId = Guid.NewGuid();
        var adminUser = new User
        {
            Id = adminUserId,
            Email = "admin@default.com",
            FirstName = "Admin",
            LastName = "User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            IsActive = true,
            TenantId = defaultTenantId,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        modelBuilder.Entity<User>().HasData(adminUser);

        // Assign all permissions to admin role
        var rolePermissions = permissions.Select(p => new RolePermission
        {
            Id = Guid.NewGuid(),
            RoleId = adminRoleId,
            PermissionId = p.Id,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        }).ToList();

        modelBuilder.Entity<RolePermission>().HasData(rolePermissions);

        // Assign admin role to admin user
        var userRole = new UserRole
        {
            Id = Guid.NewGuid(),
            UserId = adminUserId,
            RoleId = adminRoleId,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        modelBuilder.Entity<UserRole>().HasData(userRole);
    }
}
