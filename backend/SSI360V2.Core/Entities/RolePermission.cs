namespace SSI360V2.Core.Entities;

public class RolePermission : BaseEntity
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }
    
    // Navigation properties
    public virtual Role Role { get; set; } = null!;
    public virtual Permission Permission { get; set; } = null!;
}
